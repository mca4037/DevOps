# 🚀 Quick Start Guide

## Prerequisites Check
Make sure you have installed:
- ✅ Node.js (v14+)
- ✅ MongoDB (local or Atlas)
- ✅ Git

## 1-Minute Setup

### Step 1: Clone and Setup Backend
```bash
cd farmer-transport-app/backend
npm install
```

### Step 2: Environment Configuration
Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmer-transport
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_secure
JWT_EXPIRE=30d
NODE_ENV=development
```

### Step 3: Setup Frontend
```bash
cd ../frontend
npm install
```

### Step 4: Start MongoDB
```bash
# If using local MongoDB
sudo systemctl start mongod
# OR
mongod

# If using MongoDB Atlas, update MONGODB_URI in .env
```

### Step 5: Seed Database (Optional)
```bash
cd ../backend
node scripts/seed.js
```

### Step 6: Start Applications

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## 🎯 Test the Application

1. Open http://localhost:3000
2. Use demo credentials:
   - **Admin:** admin@farmertransport.com / admin123
   - **Farmer:** rajesh.farmer@example.com / farmer123
   - **Vehicle Owner:** suresh.owner@example.com / owner123

## 🔧 Troubleshooting

### Backend Issues
- **Port 5000 in use:** Change PORT in .env
- **MongoDB connection:** Check if MongoDB is running
- **Module errors:** Run `npm install` in backend directory

### Frontend Issues  
- **Proxy errors:** Ensure backend is running on port 5000
- **Build errors:** Run `npm install` in frontend directory
- **CORS issues:** Backend CORS is configured for localhost:3000

### Database Issues
- **Connection timeout:** Check MongoDB service status
- **Authentication failed:** Verify MongoDB URI credentials
- **Seed script fails:** Ensure database is accessible

## 📱 What You Can Test

### ✅ Working Features
- User authentication (login/logout)
- Role-based dashboards
- Navigation and routing
- Protected routes
- Responsive design
- Basic CRUD operations (backend)

### 🚧 In Development  
- Complete booking workflow
- Real-time tracking
- Payment integration
- Advanced search filters
- File uploads
- Push notifications

## 🎊 Success Indicators

✅ Backend server starts on port 5000  
✅ Frontend loads on port 3000  
✅ Login works with demo credentials  
✅ Different dashboards for each role  
✅ Navigation between pages works  
✅ Protected routes redirect to login  

## 🆘 Getting Help

If you encounter issues:
1. Check the main README.md for detailed setup
2. Verify all prerequisites are installed
3. Check console logs for specific errors
4. Ensure both backend and frontend are running

---

**Ready to explore? Start with the login page and navigate through different user roles!** 🎉