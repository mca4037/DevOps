import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Truck, Package, Clock, CheckCircle } from 'lucide-react';

const FarmerDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
        <p className="text-gray-600">Manage your transportation bookings and track deliveries</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/farmer/book-transport"
          className="bg-primary-600 text-white p-6 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Plus className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Book Transport</h3>
              <p className="text-primary-100">Schedule a new pickup</p>
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <Truck className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Active Bookings</h3>
              <p className="text-gray-600">3 in progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Completed</h3>
              <p className="text-gray-600">12 this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">15</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">3</div>
          <div className="text-sm text-gray-600">In Transit</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">₹15,680</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Sample booking items */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Tomatoes - 50kg</h3>
                  <p className="text-sm text-gray-600">Farm to Market</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">Delivered</div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Rice - 100kg</h3>
                  <p className="text-sm text-gray-600">Farm to Warehouse</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">In Transit</div>
                <div className="text-xs text-gray-500">ETA: 1 hour</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">Wheat - 200kg</h3>
                  <p className="text-sm text-gray-600">Farm to Processing Unit</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-yellow-600">Pending</div>
                <div className="text-xs text-gray-500">Awaiting driver</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;