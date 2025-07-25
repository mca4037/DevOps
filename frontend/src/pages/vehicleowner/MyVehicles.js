import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const MyVehicles = () => {
  const features = [
    'View all registered vehicles',
    'Vehicle status and availability toggle',
    'Performance metrics per vehicle',
    'Earnings breakdown by vehicle',
    'Maintenance schedule and reminders',
    'Document expiry alerts',
    'Quick actions (edit, deactivate)',
    'Vehicle utilization reports',
    'Customer ratings per vehicle'
  ];

  return (
    <PlaceholderPage
      title="My Vehicles"
      description="Manage your vehicle fleet and monitor performance"
      features={features}
      backLink="/vehicle-owner/dashboard"
      backText="Back to Vehicle Owner Dashboard"
    />
  );
};

export default MyVehicles;