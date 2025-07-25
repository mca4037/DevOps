import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Truck, Users, Shield, Clock, MapPin, Star } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  if (user) {
    // Redirect authenticated users to their dashboard
    const dashboardPath = getDashboardPath(user.role);
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to manage your agricultural logistics?
            </p>
            <Link
              to={dashboardPath}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Transportation for
              <span className="text-primary-600"> Farmers</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with reliable transport vehicles, reduce post-harvest losses, 
              and get your produce to market efficiently with AgriLog.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border border-primary-600 text-lg font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">30%</div>
              <div className="text-gray-600">Reduced Post-Harvest Losses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Available Transport Network</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Successful Deliveries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AgriLog Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, efficient, and reliable transportation solution for farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* For Farmers */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Farmers</h3>
              <p className="text-gray-600 mb-6">
                Book reliable transport for your produce with real-time tracking and 
                transparent pricing. Get your crops to market fresh and on time.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Easy booking process</li>
                <li>• Real-time vehicle tracking</li>
                <li>• Secure payment options</li>
                <li>• Rating and review system</li>
              </ul>
            </div>

            {/* For Vehicle Owners */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Vehicle Owners</h3>
              <p className="text-gray-600 mb-6">
                Connect with farmers in your area, accept bookings that match your 
                vehicle capacity, and earn reliable income from your transport business.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Nearby booking notifications</li>
                <li>• Flexible scheduling</li>
                <li>• Guaranteed payments</li>
                <li>• Performance analytics</li>
              </ul>
            </div>

            {/* Admin Features */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Platform</h3>
              <p className="text-gray-600 mb-6">
                All vehicles and drivers are verified for safety and reliability. 
                Comprehensive admin oversight ensures quality service for all users.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Verified vehicles and drivers</li>
                <li>• 24/7 customer support</li>
                <li>• Comprehensive insurance</li>
                <li>• Quality monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AgriLog?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Time-Sensitive</h3>
              <p className="text-gray-600">
                Quick booking and dispatch to ensure your perishable goods reach market fresh
              </p>
            </div>

            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location-Based</h3>
              <p className="text-gray-600">
                Find nearby vehicles and optimize routes for faster, cost-effective transport
              </p>
            </div>

            <div className="text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Rating system ensures high-quality service from verified drivers and vehicles
              </p>
            </div>

            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600">
                End-to-end security with insurance coverage and real-time tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Agricultural Logistics?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and vehicle owners who are already using AgriLog 
            to reduce losses and increase efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border border-white text-lg font-medium rounded-md text-white bg-transparent hover:bg-primary-700 transition-colors"
            >
              Existing User? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function getDashboardPath(role: string): string {
  switch (role) {
    case 'farmer':
      return '/farmer/dashboard';
    case 'vehicle_owner':
      return '/driver/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

export default Home;