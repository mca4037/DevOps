const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/, 'Please provide a valid vehicle number (e.g., MH12AB1234)']
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['truck', 'mini_truck', 'pickup', 'tractor', 'tempo', 'van']
  },
  capacity: {
    weight: {
      type: Number,
      required: [true, 'Weight capacity is required'],
      min: [100, 'Minimum capacity should be 100 kg']
    },
    unit: {
      type: String,
      enum: ['kg', 'tons'],
      default: 'kg'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['feet', 'meters'],
      default: 'feet'
    }
  },
  features: {
    refrigerated: {
      type: Boolean,
      default: false
    },
    covered: {
      type: Boolean,
      default: true
    },
    gps: {
      type: Boolean,
      default: false
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: false // Admin needs to approve
  },
  currentLocation: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  operatingAreas: [{
    city: String,
    state: String,
    radius: {
      type: Number,
      default: 50 // km
    }
  }],
  pricePerKm: {
    type: Number,
    required: [true, 'Price per km is required'],
    min: [1, 'Price should be at least ₹1 per km']
  },
  documents: {
    registration: {
      number: String,
      expiryDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    insurance: {
      number: String,
      expiryDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    permit: {
      number: String,
      expiryDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  images: [String],
  status: {
    type: String,
    enum: ['idle', 'booked', 'in_transit', 'maintenance'],
    default: 'idle'
  }
}, {
  timestamps: true
});

// Index for geospatial queries
VehicleSchema.index({ 'currentLocation.coordinates': '2dsphere' });
VehicleSchema.index({ owner: 1 });
VehicleSchema.index({ vehicleType: 1, isAvailable: 1, isActive: 1 });

// Method to update rating
VehicleSchema.methods.updateRating = function(newRating) {
  const totalScore = this.rating * this.totalRatings + newRating;
  this.totalRatings += 1;
  this.rating = totalScore / this.totalRatings;
  return this.save();
};

// Method to increment trip count
VehicleSchema.methods.incrementTrips = function() {
  this.totalTrips += 1;
  return this.save();
};

// Virtual for formatted capacity
VehicleSchema.virtual('formattedCapacity').get(function() {
  if (this.capacity.unit === 'tons') {
    return `${this.capacity.weight} tons`;
  }
  return `${this.capacity.weight} kg`;
});

module.exports = mongoose.model('Vehicle', VehicleSchema);