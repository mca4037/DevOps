const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmer-transport', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@farmertransport.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
      isActive: true,
      isVerified: true,
      address: {
        street: 'Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        pincode: '123456',
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        }
      }
    });

    console.log('Created admin user:', adminUser.email);

    // Create sample farmers
    const farmers = await User.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.farmer@example.com',
        password: 'farmer123',
        phone: '9876543210',
        role: 'farmer',
        isActive: true,
        isVerified: true,
        address: {
          street: 'Village Kumarganj',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226001',
          coordinates: {
            latitude: 26.8467,
            longitude: 80.9462
          }
        },
        farmDetails: {
          farmSize: '5 acres',
          primaryCrops: ['wheat', 'rice', 'sugarcane'],
          experience: '10 years'
        }
      },
      {
        name: 'Priya Sharma',
        email: 'priya.farmer@example.com',
        password: 'farmer123',
        phone: '9876543211',
        role: 'farmer',
        isActive: true,
        isVerified: true,
        address: {
          street: 'Village Rampur',
          city: 'Agra',
          state: 'Uttar Pradesh',
          pincode: '282001',
          coordinates: {
            latitude: 27.1767,
            longitude: 78.0081
          }
        },
        farmDetails: {
          farmSize: '3 acres',
          primaryCrops: ['vegetables', 'fruits'],
          experience: '7 years'
        }
      }
    ]);

    console.log('Created sample farmers:', farmers.length);

    // Create sample vehicle owners
    const vehicleOwners = await User.create([
      {
        name: 'Suresh Singh',
        email: 'suresh.owner@example.com',
        password: 'owner123',
        phone: '9876543212',
        role: 'vehicle_owner',
        isActive: true,
        isVerified: true,
        licenseNumber: 'DL123456789',
        licenseExpiry: new Date('2025-12-31'),
        address: {
          street: 'Transport Nagar',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          coordinates: {
            latitude: 28.6139,
            longitude: 77.2090
          }
        }
      },
      {
        name: 'Amit Transport',
        email: 'amit.owner@example.com',
        password: 'owner123',
        phone: '9876543213',
        role: 'vehicle_owner',
        isActive: true,
        isVerified: true,
        licenseNumber: 'DL987654321',
        licenseExpiry: new Date('2025-06-30'),
        address: {
          street: 'Transport Hub',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001',
          coordinates: {
            latitude: 28.4595,
            longitude: 77.0266
          }
        }
      }
    ]);

    console.log('Created sample vehicle owners:', vehicleOwners.length);

    // Create sample vehicles
    const vehicles = await Vehicle.create([
      {
        owner: vehicleOwners[0]._id,
        vehicleNumber: 'DL01AB1234',
        vehicleType: 'truck',
        capacity: {
          weight: 5000,
          unit: 'kg'
        },
        dimensions: {
          length: 20,
          width: 8,
          height: 8,
          unit: 'feet'
        },
        features: {
          refrigerated: false,
          covered: true,
          gps: true
        },
        isAvailable: true,
        isActive: true,
        currentLocation: {
          address: 'Transport Nagar, Delhi',
          coordinates: {
            latitude: 28.6139,
            longitude: 77.2090
          }
        },
        operatingAreas: [{
          city: 'Delhi',
          state: 'Delhi',
          radius: 100
        }],
        pricePerKm: 15,
        documents: {
          registration: {
            number: 'REG123456',
            expiryDate: new Date('2025-12-31'),
            verified: true
          },
          insurance: {
            number: 'INS123456',
            expiryDate: new Date('2025-12-31'),
            verified: true
          }
        }
      },
      {
        owner: vehicleOwners[1]._id,
        vehicleNumber: 'HR02CD5678',
        vehicleType: 'mini_truck',
        capacity: {
          weight: 2000,
          unit: 'kg'
        },
        dimensions: {
          length: 12,
          width: 6,
          height: 6,
          unit: 'feet'
        },
        features: {
          refrigerated: true,
          covered: true,
          gps: true
        },
        isAvailable: true,
        isActive: true,
        currentLocation: {
          address: 'Transport Hub, Gurgaon',
          coordinates: {
            latitude: 28.4595,
            longitude: 77.0266
          }
        },
        operatingAreas: [{
          city: 'Gurgaon',
          state: 'Haryana',
          radius: 150
        }],
        pricePerKm: 12,
        documents: {
          registration: {
            number: 'REG789012',
            expiryDate: new Date('2025-12-31'),
            verified: true
          },
          insurance: {
            number: 'INS789012',
            expiryDate: new Date('2025-12-31'),
            verified: true
          }
        }
      }
    ]);

    console.log('Created sample vehicles:', vehicles.length);

    // Create sample booking
    const sampleBooking = await Booking.create({
      farmer: farmers[0]._id,
      vehicle: vehicles[0]._id,
      vehicleOwner: vehicleOwners[0]._id,
      produce: {
        type: 'grains',
        name: 'Wheat',
        quantity: {
          amount: 1000,
          unit: 'kg'
        },
        specialRequirements: {
          temperature: 'ambient',
          handling: 'careful',
          notes: 'Dry storage required'
        }
      },
      pickup: {
        address: {
          street: 'Village Kumarganj',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226001'
        },
        coordinates: {
          latitude: 26.8467,
          longitude: 80.9462
        },
        contactPerson: {
          name: 'Rajesh Kumar',
          phone: '9876543210'
        },
        preferredTime: {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          timeSlot: 'morning'
        }
      },
      dropoff: {
        address: {
          street: 'Grain Market',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        },
        contactPerson: {
          name: 'Market Manager',
          phone: '9999999999'
        }
      },
      distance: 350, // km
      pricing: {
        baseAmount: 5250, // 350 km * 15 per km
        totalAmount: 5250,
        additionalCharges: {
          loading: 0,
          unloading: 0,
          waiting: 0,
          toll: 0
        }
      }
    });

    console.log('Created sample booking:', sampleBooking.bookingId);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@farmertransport.com / admin123');
    console.log('Farmer: rajesh.farmer@example.com / farmer123');
    console.log('Vehicle Owner: suresh.owner@example.com / owner123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();