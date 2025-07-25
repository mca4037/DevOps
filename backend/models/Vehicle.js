const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['tractor', 'tempo', 'truck', 'mini_truck', 'pickup', 'auto_rickshaw'],
    required: [true, 'Please specify vehicle type']
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Please add vehicle number'],
    unique: true,
    uppercase: true
  },
  brand: {
    type: String,
    required: [true, 'Please add vehicle brand']
  },
  model: {
    type: String,
    required: [true, 'Please add vehicle model']
  },
  year: {
    type: Number,
    min: 1990,
    max: new Date().getFullYear()
  },
  capacity: {
    weight: {
      type: Number,
      required: [true, 'Please specify weight capacity in kg'],
      min: 0
    },
    volume: {
      type: Number,
      min: 0
    }
  },
  images: [{
    type: String
  }],
  documents: {
    registration: String,
    insurance: String,
    permit: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  baseLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  serviceAreas: [{
    district: String,
    state: String,
    maxDistance: {
      type: Number,
      default: 50 // km
    }
  }],
  pricing: {
    baseRate: {
      type: Number,
      required: [true, 'Please set base rate per km'],
      min: 0
    },
    perKgRate: {
      type: Number,
      default: 0
    },
    minimumCharge: {
      type: Number,
      default: 0
    }
  },
  features: [{
    type: String,
    enum: ['gps_tracking', 'refrigerated', 'covered', 'open', 'hydraulic_lift', 'side_loading']
  }],
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
  }
}, {
  timestamps: true
});

// Create geospatial indexes
vehicleSchema.index({ currentLocation: '2dsphere' });
vehicleSchema.index({ baseLocation: '2dsphere' });

module.exports = mongoose.model('Vehicle', vehicleSchema);