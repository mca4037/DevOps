import React from 'react';
import { Users, Truck, Package, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage the AgriLog platform</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">1,247</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2 text-xs text-green-600">+12% from last month</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">342</div>
              <div className="text-sm text-gray-600">Active Vehicles</div>
            </div>
            <Truck className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2 text-xs text-green-600">+8% from last month</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">2,156</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-2 text-xs text-green-600">+23% from last month</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">₹8.4L</div>
              <div className="text-sm text-gray-600">Platform Revenue</div>
            </div>
            <BarChart3 className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="mt-2 text-xs text-green-600">+18% from last month</div>
        </div>
      </div>

      {/* Pending Verifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              Pending User Verifications
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <div>
                  <h3 className="font-medium">Rajesh Kumar</h3>
                  <p className="text-sm text-gray-600">Farmer • rajesh@email.com</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <div>
                  <h3 className="font-medium">Suresh Singh</h3>
                  <p className="text-sm text-gray-600">Vehicle Owner • suresh@email.com</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              Pending Vehicle Verifications
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <div>
                  <h3 className="font-medium">Tata Ace - DL1234</h3>
                  <p className="text-sm text-gray-600">Owner: Amit Sharma</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <div>
                  <h3 className="font-medium">Mahindra Bolero - HR5678</h3>
                  <p className="text-sm text-gray-600">Owner: Ravi Gupta</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Booking #2156 completed successfully</p>
                <p className="text-xs text-gray-500">Farmer: Mohan Lal • Driver: Pradeep Kumar • 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">New farmer registered</p>
                <p className="text-xs text-gray-500">Sita Devi from Haryana • 3 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border-l-4 border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Vehicle verification pending</p>
                <p className="text-xs text-gray-500">Eicher truck by Ram Singh • 4 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Vehicle added to platform</p>
                <p className="text-xs text-gray-500">Mahindra Pickup by Kiran Kumar • 5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              View All Users
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Pending Verifications
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              User Reports
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Management</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              View All Vehicles
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Verification Queue
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Performance Analytics
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Management</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              View All Bookings
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Disputed Bookings
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Revenue Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;