# AgriLog - Smart Transportation Platform for Farmers

AgriLog is a comprehensive MERN stack application that connects farmers with vehicle owners to provide efficient transportation solutions for agricultural produce. Built to address the 30% post-harvest losses due to lack of reliable transportation, AgriLog offers real-time booking, tracking, and management features.

## 🌟 Features

### For Farmers
- **Easy Booking**: Simple interface to book transportation for produce
- **Real-time Tracking**: Track your shipments from pickup to delivery
- **Multiple Produce Types**: Support for vegetables, fruits, grains, dairy, livestock
- **Transparent Pricing**: Clear cost estimation before booking
- **Rating System**: Rate drivers and vehicles after delivery
- **Booking History**: Complete history of all transportation bookings

### For Vehicle Owners/Drivers
- **Vehicle Registration**: Register multiple vehicles with detailed specifications
- **Real-time Notifications**: Instant alerts for nearby booking requests
- **Route Optimization**: Location-based booking suggestions
- **Earnings Tracking**: Monitor income and trip analytics
- **Availability Management**: Control when and where you're available for bookings
- **Performance Analytics**: Track ratings, completed trips, and earnings

### For Administrators
- **User Management**: Verify and manage farmers and vehicle owners
- **Vehicle Verification**: Approve vehicle registrations and documents
- **Platform Analytics**: Comprehensive dashboard with key metrics
- **Booking Oversight**: Monitor all platform activities
- **Revenue Tracking**: Platform-wide financial analytics
- **Quality Control**: Ensure service quality through monitoring and feedback

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication with bcrypt password hashing
- **Socket.IO** for real-time communication
- **Multer** for file uploads
- **Nodemailer** for email notifications

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Socket.IO Client** for real-time updates
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Database
- **MongoDB** with geospatial indexing for location-based queries
- **Optimized schemas** for users, vehicles, and bookings
- **Role-based access control**

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd agrilog
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update environment variables
nano .env
```

### 3. Environment Configuration
Update the `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agrilog
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Email Configuration (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Environment
NODE_ENV=development
```

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# Start MongoDB (Ubuntu/Debian)
sudo systemctl start mongod

# Or start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Or start MongoDB (Windows)
net start MongoDB
```

### 5. Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

### 6. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```
The frontend will start on `http://localhost:3000`

## 📱 Demo Accounts

For testing purposes, you can use these demo accounts:

### Farmer Account
- **Email**: farmer@demo.com
- **Password**: password123

### Vehicle Owner Account
- **Email**: driver@demo.com
- **Password**: password123

### Admin Account
- **Email**: admin@demo.com
- **Password**: password123

## 🗂️ Project Structure

```
agrilog/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication & validation
│   ├── controllers/      # Route controllers
│   ├── config/          # Database configuration
│   ├── uploads/         # File uploads directory
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   ├── public/          # Static files
│   └── package.json     # Frontend dependencies
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/location` - Update location

### Vehicles
- `GET /api/vehicles/search` - Search available vehicles
- `POST /api/vehicles` - Add new vehicle
- `GET /api/vehicles/my-vehicles` - Get user's vehicles
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get farmer's bookings
- `GET /api/bookings/my-trips` - Get driver's trips
- `PUT /api/bookings/:id/accept` - Accept booking
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/rate` - Rate booking

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/vehicles` - Manage vehicles
- `GET /api/admin/analytics` - Platform analytics

## 🌐 Real-time Features

AgriLog uses Socket.IO for real-time communication:
- **Booking Notifications**: Instant alerts for new booking requests
- **Status Updates**: Real-time booking status changes
- **Location Tracking**: Live vehicle location updates
- **Chat Support**: Real-time communication between farmers and drivers

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-based Access**: Different permissions for farmers, drivers, and admins
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Safe file handling with type restrictions

## 📊 Database Schema

### User Model
- Personal information (name, email, phone)
- Role-based fields (farmer/vehicle_owner/admin)
- Location data with geospatial indexing
- Authentication and verification status

### Vehicle Model
- Vehicle specifications and capacity
- Owner information and verification status
- Pricing and service area configuration
- Performance metrics and ratings

### Booking Model
- Produce details and transportation requirements
- Pickup and delivery locations
- Status tracking and timeline
- Pricing and payment information
- Rating and feedback system

## 🚧 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Formatting
```bash
# Format backend code
cd backend
npm run format

# Format frontend code
cd frontend
npm run format
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, email support@agrilog.com or join our Slack channel.

## 🔮 Future Enhancements

- **Mobile Applications**: React Native apps for iOS and Android
- **Payment Integration**: UPI, credit card, and wallet payments
- **AI Route Optimization**: Machine learning for optimal routing
- **Weather Integration**: Weather-based booking suggestions
- **Multi-language Support**: Localization for regional languages
- **IoT Integration**: Temperature and humidity monitoring
- **Blockchain**: Transparent supply chain tracking

## 📈 Roadmap

- **Phase 1**: Core platform with basic booking and tracking
- **Phase 2**: Advanced analytics and AI features
- **Phase 3**: Mobile applications and payment integration
- **Phase 4**: IoT and blockchain integration

---

Built with ❤️ for farmers and the agricultural community.