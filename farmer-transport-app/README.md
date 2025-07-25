# 🚛 Farmer Transport Management System

A comprehensive MERN stack application that connects farmers with reliable vehicle owners for efficient produce transportation. This platform enables farmers to book transport services while allowing vehicle owners to manage their fleet and accept booking requests, all overseen by an admin panel.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Demo Credentials](#demo-credentials)
- [User Roles & Capabilities](#user-roles--capabilities)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

## ✨ Features

### 👨‍🌾 For Farmers
- **Vehicle Booking**: Search and book vehicles based on location, type, and capacity
- **Real-time Tracking**: Track shipments and receive status updates
- **Rating System**: Rate and review vehicle owners and services
- **Booking Management**: View booking history and manage active bookings
- **Expense Tracking**: Monitor transport costs and generate reports

### 🚚 For Vehicle Owners
- **Fleet Management**: Register and manage multiple vehicles
- **Booking Requests**: Receive and respond to farmer booking requests
- **Earnings Dashboard**: Track income and performance metrics
- **Route Optimization**: Get suggestions for efficient routes
- **Customer Communication**: Chat with farmers during trips

### 👨‍💼 For Administrators
- **User Management**: Approve, monitor, and manage all users
- **Vehicle Approval**: Review and approve vehicle registrations
- **System Monitoring**: Real-time monitoring of all platform activities
- **Analytics**: Comprehensive business intelligence and reporting
- **Dispute Resolution**: Handle complaints and resolve conflicts

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** for cross-origin requests

### Frontend
- **React.js** with hooks and context API
- **React Router DOM** for routing
- **React Bootstrap** for UI components
- **Axios** for API communications
- **React Icons** for iconography

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd farmer-transport-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
# Update the following variables:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (a secure random string)
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file (optional)
# Create .env file in frontend directory for custom API URL
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use default connection string: `mongodb://localhost:27017/farmer-transport`

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in backend/.env

### 5. Seed Sample Data (Optional)

```bash
cd backend
node scripts/seed.js
```

This will create:
- Admin user
- Sample farmers and vehicle owners
- Sample vehicles
- Sample bookings

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
# or
npm start
```

The backend server will start on `http://localhost:5000`

### Start Frontend Application

```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000`

### Access the Application

Open your browser and navigate to `http://localhost:3000`

## 🔑 Demo Credentials

Use these credentials to test different user roles:

### Admin Account
- **Email**: admin@farmertransport.com
- **Password**: admin123

### Farmer Account
- **Email**: rajesh.farmer@example.com
- **Password**: farmer123

### Vehicle Owner Account
- **Email**: suresh.owner@example.com
- **Password**: owner123

## 🎭 User Roles & Capabilities

### Farmer Interface
- ✅ Dashboard with booking overview
- ✅ Vehicle search and filtering
- ✅ Booking creation and management
- ✅ Real-time tracking
- ✅ Rating and review system
- 🚧 Payment integration (planned)
- 🚧 Advanced notifications (planned)

### Vehicle Owner Interface
- ✅ Fleet management dashboard
- ✅ Vehicle registration and editing
- ✅ Booking request management
- ✅ Earnings tracking
- 🚧 Route optimization (planned)
- 🚧 Driver management (planned)

### Admin Panel
- ✅ User management and approval
- ✅ Vehicle verification system
- ✅ System analytics and reporting
- ✅ Booking monitoring
- 🚧 Financial management (planned)
- 🚧 Advanced analytics (planned)

## 📁 Project Structure

```
farmer-transport-app/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication & validation
│   ├── controllers/     # Business logic
│   ├── config/          # Configuration files
│   ├── scripts/         # Utility scripts (seeding, etc.)
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context for state management
│   │   ├── services/    # API service layer
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main App component
│   ├── public/
│   └── package.json
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Vehicle Endpoints
- `GET /api/vehicles` - Get all vehicles (with filters)
- `POST /api/vehicles` - Register new vehicle (Vehicle Owner)
- `GET /api/vehicles/my/vehicles` - Get owner's vehicles
- `PUT /api/vehicles/:id` - Update vehicle details

### Booking Endpoints
- `POST /api/bookings` - Create new booking (Farmer)
- `GET /api/bookings/my` - Get user's bookings
- `PUT /api/bookings/:id/respond` - Accept/reject booking (Vehicle Owner)
- `PUT /api/bookings/:id/status` - Update booking status

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/vehicles` - Manage vehicles
- `GET /api/admin/analytics/bookings` - Booking analytics

## 🔮 Future Enhancements

### Core Features
- [ ] Real-time chat system
- [ ] GPS tracking integration
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Mobile app development

### Advanced Features
- [ ] AI-powered route optimization
- [ ] Predictive analytics
- [ ] Multi-language support
- [ ] API for third-party integrations
- [ ] Advanced reporting dashboard

### Technical Improvements
- [ ] Redis caching
- [ ] Load balancing
- [ ] Microservices architecture
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmer-transport
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check if MongoDB is running
   - Verify environment variables
   - Check port 5000 is available

2. **Frontend can't connect to backend**
   - Ensure backend server is running
   - Check CORS configuration
   - Verify API URL in frontend .env

3. **Database connection issues**
   - Verify MongoDB URI
   - Check network connectivity for Atlas
   - Ensure database permissions

## 📞 Support

For support and questions, please contact:
- Email: support@farmertransport.com
- GitHub Issues: [Create an issue](../../issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the farming community**