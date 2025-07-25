import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
        
        {user && (
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.isVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </p>
            </div>
          </div>
        )}
        
        <div className="text-center py-8">
          <h2 className="text-xl text-gray-600 mb-4">Profile Management Coming Soon</h2>
          <p className="text-gray-500">
            Full profile editing capabilities will be available here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;