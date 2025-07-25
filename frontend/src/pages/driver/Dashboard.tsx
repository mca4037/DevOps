import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Clock, DollarSign, Star } from 'lucide-react';

const DriverDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600">Manage your vehicles and accept booking requests</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/driver/register-vehicle"
          className="bg-primary-600 text-white p-6 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Plus className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Add Vehicle</h3>
              <p className="text-primary-100">Register a new vehicle</p>
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Available Requests</h3>
              <p className="text-gray-600">5 nearby</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Active Trips</h3>
              <p className="text-gray-600">2 in progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">24</div>
          <div className="text-sm text-gray-600">Total Trips</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">₹28,450</div>
          <div className="text-sm text-gray-600">Total Earnings</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600 flex items-center">
            4.8
            <Star className="h-4 w-4 ml-1 text-yellow-400 fill-current" />
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">2</div>
          <div className="text-sm text-gray-600">Active Vehicles</div>
        </div>
      </div>

      {/* Available Bookings */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Available Bookings Nearby</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Sample booking requests */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Vegetables - 75kg</h3>
                  <p className="text-sm text-gray-600">Pickup: Village Farm • Drop: City Market</p>
                  <p className="text-xs text-gray-500">Distance: 15 km • Urgency: High</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">₹450</div>
                <button className="mt-1 px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                  Accept
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">Grains - 150kg</h3>
                  <p className="text-sm text-gray-600">Pickup: Rural Farm • Drop: Processing Center</p>
                  <p className="text-xs text-gray-500">Distance: 25 km • Urgency: Medium</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">₹750</div>
                <button className="mt-1 px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                  Accept
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Fruits - 100kg</h3>
                  <p className="text-sm text-gray-600">Pickup: Orchard • Drop: Wholesale Market</p>
                  <p className="text-xs text-gray-500">Distance: 12 km • Urgency: Urgent</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">₹600</div>
                <button className="mt-1 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Vehicles */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Vehicles</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Tata Ace</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Available</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">DL-1234 • Capacity: 750kg</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Rating: 4.8⭐</span>
                <span>Trips: 15</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Mahindra Bolero</h3>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">On Trip</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">HR-5678 • Capacity: 1000kg</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Rating: 4.9⭐</span>
                <span>Trips: 9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;