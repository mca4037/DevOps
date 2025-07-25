const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { protect, farmerOnly, vehicleOwnerOnly } = require('../middleware/auth');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Farmers only)
router.post('/', protect, farmerOnly, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      farmer: req.user.id
    };

    // Calculate estimated cost based on distance and vehicle rates
    const { produce, locations } = bookingData;
    
    // Simple distance calculation (you can integrate with Google Maps API for accurate calculation)
    const distance = calculateDistance(
      locations.pickup.coordinates,
      locations.dropoff.coordinates
    );

    bookingData.pricing = {
      ...bookingData.pricing,
      distance
    };

    const booking = await Booking.create(bookingData);
    
    // Populate the booking with farmer details
    await booking.populate('farmer', 'name email phone');

    // Emit real-time notification to nearby vehicle owners
    if (req.io) {
      req.io.emit('booking_request', {
        booking: booking.toObject(),
        location: locations.pickup.coordinates
      });
    }

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      message: 'Server error creating booking',
      error: error.message
    });
  }
});

// @desc    Get bookings for farmer
// @route   GET /api/bookings/my-bookings
// @access  Private (Farmers only)
router.get('/my-bookings', protect, farmerOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { farmer: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('vehicle', 'vehicleType vehicleNumber brand model')
      .populate('driver', 'name email phone rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get available bookings for vehicle owners
// @route   GET /api/bookings/available
// @access  Private (Vehicle Owners only)
router.get('/available', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50 } = req.query;
    
    let query = {
      status: 'pending',
      vehicle: null
    };

    let bookings;

    if (latitude && longitude) {
      // Location-based search for nearby bookings
      bookings = await Booking.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            distanceField: 'distance',
            maxDistance: parseFloat(maxDistance) * 1000,
            spherical: true,
            query: query,
            key: 'locations.pickup.coordinates'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'farmer',
            foreignField: '_id',
            as: 'farmer'
          }
        },
        {
          $unwind: '$farmer'
        },
        {
          $project: {
            'farmer.password': 0
          }
        },
        {
          $sort: { distance: 1, createdAt: -1 }
        }
      ]);
    } else {
      bookings = await Booking.find(query)
        .populate('farmer', 'name email phone rating')
        .sort({ createdAt: -1 })
        .limit(20);
    }

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get available bookings error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get bookings for vehicle owner
// @route   GET /api/bookings/my-trips
// @access  Private (Vehicle Owners only)
router.get('/my-trips', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { driver: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('farmer', 'name email phone')
      .populate('vehicle', 'vehicleType vehicleNumber brand model')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Accept booking
// @route   PUT /api/bookings/:id/accept
// @access  Private (Vehicle Owners only)
router.put('/:id/accept', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const { vehicleId } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is no longer available' });
    }

    // Verify vehicle ownership
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to use this vehicle' });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    // Update booking
    booking.status = 'accepted';
    booking.vehicle = vehicleId;
    booking.driver = req.user.id;
    booking.timeline.push({
      status: 'accepted',
      timestamp: new Date(),
      notes: 'Booking accepted by driver'
    });

    await booking.save();

    // Update vehicle availability
    vehicle.isAvailable = false;
    await vehicle.save();

    await booking.populate([
      { path: 'farmer', select: 'name email phone' },
      { path: 'vehicle', select: 'vehicleType vehicleNumber brand model' },
      { path: 'driver', select: 'name email phone rating' }
    ]);

    // Emit real-time notification to farmer
    if (req.io) {
      req.io.to(`farmer_${booking.farmer._id}`).emit('booking_accepted', {
        booking: booking.toObject()
      });
    }

    res.json({
      success: true,
      message: 'Booking accepted successfully',
      booking
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Vehicle Owners only)
router.put('/:id/status', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const { status, notes, location } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.driver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Validate status transitions
    const validTransitions = {
      'accepted': ['en_route_pickup', 'cancelled'],
      'en_route_pickup': ['picked_up', 'cancelled'],
      'picked_up': ['en_route_delivery'],
      'en_route_delivery': ['delivered']
    };

    if (!validTransitions[booking.status] || !validTransitions[booking.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    // Update booking
    booking.status = status;
    booking.timeline.push({
      status,
      timestamp: new Date(),
      notes,
      location
    });

    // Update earnings and trip count if delivered
    if (status === 'delivered') {
      const vehicle = await Vehicle.findById(booking.vehicle);
      const driver = await User.findById(booking.driver);
      
      if (vehicle && driver) {
        vehicle.totalTrips += 1;
        vehicle.isAvailable = true; // Make vehicle available again
        await vehicle.save();

        driver.completedTrips += 1;
        if (booking.pricing.finalCost) {
          driver.earnings += booking.pricing.finalCost;
        }
        await driver.save();
      }
    }

    await booking.save();

    await booking.populate([
      { path: 'farmer', select: 'name email phone' },
      { path: 'vehicle', select: 'vehicleType vehicleNumber brand model' },
      { path: 'driver', select: 'name email phone rating' }
    ]);

    // Emit real-time notification
    if (req.io) {
      req.io.to(`farmer_${booking.farmer._id}`).emit('booking_status_update', {
        booking: booking.toObject(),
        status,
        notes
      });
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Rate booking
// @route   PUT /api/bookings/:id/rate
// @access  Private
router.put('/:id/rate', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'delivered') {
      return res.status(400).json({ message: 'Booking must be completed to rate' });
    }

    const isFarmer = booking.farmer.toString() === req.user.id;
    const isDriver = booking.driver.toString() === req.user.id;

    if (!isFarmer && !isDriver) {
      return res.status(403).json({ message: 'Not authorized to rate this booking' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Add rating
    if (isFarmer) {
      if (booking.rating.farmerRating.rating) {
        return res.status(400).json({ message: 'You have already rated this booking' });
      }
      
      booking.rating.farmerRating = {
        rating,
        comment,
        timestamp: new Date()
      };

      // Update driver's rating
      const driver = await User.findById(booking.driver);
      if (driver) {
        const newTotal = driver.totalRatings + 1;
        driver.rating = ((driver.rating * driver.totalRatings) + rating) / newTotal;
        driver.totalRatings = newTotal;
        await driver.save();
      }
    } else {
      if (booking.rating.driverRating.rating) {
        return res.status(400).json({ message: 'You have already rated this booking' });
      }
      
      booking.rating.driverRating = {
        rating,
        comment,
        timestamp: new Date()
      };

      // Update farmer's rating
      const farmer = await User.findById(booking.farmer);
      if (farmer) {
        const newTotal = farmer.totalRatings + 1;
        farmer.rating = ((farmer.rating * farmer.totalRatings) + rating) / newTotal;
        farmer.totalRatings = newTotal;
        await farmer.save();
      }
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: isFarmer ? booking.rating.farmerRating : booking.rating.driverRating
    });
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isFarmer = booking.farmer.toString() === req.user.id;
    const isDriver = booking.driver && booking.driver.toString() === req.user.id;

    if (!isFarmer && !isDriver) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (['delivered', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      notes: `Cancelled by ${isFarmer ? 'farmer' : 'driver'}: ${reason}`
    });

    // Make vehicle available again if it was assigned
    if (booking.vehicle) {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { isAvailable: true });
    }

    await booking.save();

    // Emit real-time notification
    if (req.io) {
      const targetUserId = isFarmer ? booking.driver : booking.farmer;
      const targetUserType = isFarmer ? 'driver' : 'farmer';
      
      if (targetUserId) {
        req.io.to(`${targetUserType}_${targetUserId}`).emit('booking_cancelled', {
          booking: booking.toObject(),
          reason
        });
      }
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('farmer', 'name email phone rating')
      .populate('vehicle', 'vehicleType vehicleNumber brand model capacity pricing')
      .populate('driver', 'name email phone rating');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    const isFarmer = booking.farmer._id.toString() === req.user.id;
    const isDriver = booking.driver && booking.driver._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isFarmer && !isDriver && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Helper function to calculate distance between two coordinates
function calculateDistance(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

module.exports = router;