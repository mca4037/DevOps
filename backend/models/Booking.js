const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  produce: {
    type: {
      type: String,
      required: [true, 'Please specify produce type'],
      enum: ['vegetables', 'fruits', 'grains', 'dairy', 'livestock', 'other']
    },
    items: [{
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        enum: ['kg', 'quintal', 'ton', 'pieces', 'bags'],
        required: true
      }
    }],
    totalWeight: {
      type: Number,
      required: [true, 'Please specify total weight in kg'],
      min: 0
    },
    isPerishable: {
      type: Boolean,
      default: false
    },
    specialInstructions: String
  },
  locations: {
    pickup: {
      address: {
        type: String,
        required: [true, 'Please provide pickup address']
      },
      coordinates: {
        type: [Number],
        required: true
      },
      contactPerson: String,
      contactPhone: String
    },
    dropoff: {
      address: {
        type: String,
        required: [true, 'Please provide dropoff address']
      },
      coordinates: {
        type: [Number],
        required: true
      },
      contactPerson: String,
      contactPhone: String
    }
  },
  timing: {
    preferredDate: {
      type: Date,
      required: true
    },
    preferredTime: {
      type: String,
      required: true
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  },
  pricing: {
    estimatedCost: {
      type: Number,
      min: 0
    },
    finalCost: {
      type: Number,
      min: 0
    },
    distance: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'en_route_pickup', 'picked_up', 'en_route_delivery', 'delivered', 'cancelled', 'rejected'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String,
    location: {
      type: [Number]
    }
  }],
  rating: {
    farmerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      timestamp: Date
    },
    driverRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      timestamp: Date
    }
  },
  documents: {
    invoices: [String],
    receipts: [String],
    photos: [String]
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'bank_transfer', 'card'],
    default: 'cash'
  },
  cancellationReason: String,
  adminNotes: String
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ farmer: 1, createdAt: -1 });
bookingSchema.index({ driver: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'locations.pickup.coordinates': '2dsphere' });
bookingSchema.index({ 'locations.dropoff.coordinates': '2dsphere' });

module.exports = mongoose.model('Booking', bookingSchema);