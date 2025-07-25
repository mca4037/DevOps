import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const UserManagement = () => {
  const features = [
    'View all registered users (farmers, vehicle owners)',
    'User verification and approval workflow',
    'Search and filter users by various criteria',
    'Activate/deactivate user accounts',
    'View user activity and statistics',
    'Handle user complaints and disputes',
    'Send notifications and announcements',
    'Export user data for analysis',
    'Bulk operations for user management'
  ];

  return (
    <PlaceholderPage
      title="User Management"
      description="Comprehensive user administration and account management"
      features={features}
      backLink="/admin/dashboard"
      backText="Back to Admin Dashboard"
    />
  );
};

export default UserManagement;