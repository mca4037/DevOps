const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect, vehicleOwnerOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @desc    Add new vehicle
// @route   POST /api/vehicles
// @access  Private (Vehicle Owners only)
router.post('/', protect, vehicleOwnerOnly, upload.array('images', 5), async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      owner: req.user.id
    };

    // Add uploaded images
    if (req.files && req.files.length > 0) {
      vehicleData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Parse JSON fields
    if (typeof req.body.capacity === 'string') {
      vehicleData.capacity = JSON.parse(req.body.capacity);
    }
    if (typeof req.body.pricing === 'string') {
      vehicleData.pricing = JSON.parse(req.body.pricing);
    }
    if (typeof req.body.baseLocation === 'string') {
      vehicleData.baseLocation = JSON.parse(req.body.baseLocation);
    }
    if (typeof req.body.serviceAreas === 'string') {
      vehicleData.serviceAreas = JSON.parse(req.body.serviceAreas);
    }
    if (typeof req.body.features === 'string') {
      vehicleData.features = JSON.parse(req.body.features);
    }

    const vehicle = await Vehicle.create(vehicleData);
    await vehicle.populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      vehicle
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({
      message: 'Server error adding vehicle',
      error: error.message
    });
  }
});

// @desc    Get vehicles by owner
// @route   GET /api/vehicles/my-vehicles
// @access  Private (Vehicle Owners only)
router.get('/my-vehicles', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id })
      .populate('owner', 'name email phone rating');

    res.json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Search available vehicles
// @route   GET /api/vehicles/search
// @access  Private
router.get('/search', protect, async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      maxDistance = 50,
      vehicleType,
      minCapacity,
      maxPrice
    } = req.query;

    let query = {
      isAvailable: true,
      isVerified: true
    };

    // Add vehicle type filter
    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    // Add capacity filter
    if (minCapacity) {
      query['capacity.weight'] = { $gte: parseFloat(minCapacity) };
    }

    // Add price filter
    if (maxPrice) {
      query['pricing.baseRate'] = { $lte: parseFloat(maxPrice) };
    }

    let vehicles;

    if (latitude && longitude) {
      // Location-based search
      vehicles = await Vehicle.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            distanceField: 'distance',
            maxDistance: parseFloat(maxDistance) * 1000, // Convert to meters
            spherical: true,
            query: query
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            as: 'owner'
          }
        },
        {
          $unwind: '$owner'
        },
        {
          $project: {
            'owner.password': 0
          }
        },
        {
          $sort: { distance: 1 }
        }
      ]);
    } else {
      // General search without location
      vehicles = await Vehicle.find(query)
        .populate('owner', 'name email phone rating')
        .sort({ rating: -1, totalTrips: -1 });
    }

    res.json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    console.error('Search vehicles error:', error);
    res.status(500).json({
      message: 'Server error searching vehicles',
      error: error.message
    });
  }
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name email phone rating totalRatings');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Vehicle Owner only)
router.put('/:id', protect, vehicleOwnerOnly, upload.array('images', 5), async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if user owns the vehicle
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this vehicle' });
    }

    const updateData = { ...req.body };

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = [...(vehicle.images || []), ...newImages];
    }

    // Parse JSON fields
    if (typeof req.body.capacity === 'string') {
      updateData.capacity = JSON.parse(req.body.capacity);
    }
    if (typeof req.body.pricing === 'string') {
      updateData.pricing = JSON.parse(req.body.pricing);
    }
    if (typeof req.body.serviceAreas === 'string') {
      updateData.serviceAreas = JSON.parse(req.body.serviceAreas);
    }
    if (typeof req.body.features === 'string') {
      updateData.features = JSON.parse(req.body.features);
    }

    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update vehicle availability
// @route   PUT /api/vehicles/:id/availability
// @access  Private (Vehicle Owner only)
router.put('/:id/availability', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if user owns the vehicle
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this vehicle' });
    }

    vehicle.isAvailable = isAvailable;
    await vehicle.save();

    res.json({
      success: true,
      message: `Vehicle ${isAvailable ? 'marked as available' : 'marked as unavailable'}`,
      isAvailable: vehicle.isAvailable
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update vehicle location
// @route   PUT /api/vehicles/:id/location
// @access  Private (Vehicle Owner only)
router.put('/:id/location', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if user owns the vehicle
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this vehicle' });
    }

    vehicle.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };

    await vehicle.save();

    res.json({
      success: true,
      message: 'Vehicle location updated successfully',
      location: vehicle.currentLocation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Vehicle Owner only)
router.delete('/:id', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if user owns the vehicle
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this vehicle' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;