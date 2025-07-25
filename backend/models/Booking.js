const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  vehicleOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  produce: {
    type: {
      type: String,
      required: [true, 'Produce type is required'],
      enum: ['grains', 'vegetables', 'fruits', 'dairy', 'livestock', 'equipment', 'seeds', 'fertilizer', 'other']
    },
    name: {
      type: String,
      required: [true, 'Produce name is required']
    },
    quantity: {
      amount: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
      },
      unit: {
        type: String,
        enum: ['kg', 'tons', 'quintal', 'bags', 'boxes', 'liters'],
        required: true
      }
    },
    specialRequirements: {
      temperature: String,
      handling: String,
      notes: String
    }
  },
  pickup: {
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      }
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    contactPerson: {
      name: String,
      phone: String
    },
    preferredTime: {
      date: {
        type: Date,
        required: true
      },
      timeSlot: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'flexible'],
        default: 'flexible'
      }
    },
    actualTime: Date
  },
  dropoff: {
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      }
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    contactPerson: {
      name: String,
      phone: String
    },
    actualTime: Date
  },
  distance: {
    type: Number, // in kilometers
    required: true
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true
    },
    additionalCharges: {
      loading: {
        type: Number,
        default: 0
      },
      unloading: {
        type: Number,
        default: 0
      },
      waiting: {
        type: Number,
        default: 0
      },
      toll: {
        type: Number,
        default: 0
      }
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'advance_paid', 'partial_paid', 'completed'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'confirmed', 'pickup_scheduled', 'in_transit', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  tracking: {
    currentLocation: {
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      address: String,
      timestamp: Date
    },
    route: [{
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      timestamp: Date
    }]
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageType: {
      type: String,
      enum: ['text', 'location', 'image'],
      default: 'text'
    }
  }],
  rating: {
    farmerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      timestamp: Date
    },
    vehicleOwnerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      timestamp: Date
    }
  },
  documents: {
    invoice: String,
    receipt: String,
    deliveryProof: [String] // Images
  }
}, {
  timestamps: true
});

// Indexes
BookingSchema.index({ farmer: 1, createdAt: -1 });
BookingSchema.index({ vehicleOwner: 1, createdAt: -1 });
BookingSchema.index({ vehicle: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ 'pickup.coordinates': '2dsphere' });
BookingSchema.index({ 'dropoff.coordinates': '2dsphere' });

// Pre-save middleware to generate booking ID
BookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'BKG' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Method to update status with history
BookingSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    updatedBy: updatedBy,
    notes: notes,
    timestamp: new Date()
  });
  return this.save();
};

// Method to add communication
BookingSchema.methods.addMessage = function(senderId, message, messageType = 'text') {
  this.communication.push({
    sender: senderId,
    message: message,
    messageType: messageType,
    timestamp: new Date()
  });
  return this.save();
};

// Virtual for formatted distance
BookingSchema.virtual('formattedDistance').get(function() {
  return `${this.distance.toFixed(1)} km`;
});

module.exports = mongoose.model('Booking', BookingSchema);