import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const VehicleManagement = () => {
  const features = [
    'Add new vehicle with complete details',
    'Upload vehicle photos and documents',
    'Set pricing and availability preferences',
    'Define operating areas and routes',
    'Vehicle specification management',
    'Insurance and permit tracking',
    'Maintenance history logging',
    'Driver assignment (if applicable)',
    'Bulk operations for multiple vehicles'
  ];

  return (
    <PlaceholderPage
      title="Vehicle Management"
      description="Add, edit, and manage your vehicles and their details"
      features={features}
      backLink="/vehicle-owner/dashboard"
      backText="Back to Vehicle Owner Dashboard"
    />
  );
};

export default VehicleManagement;