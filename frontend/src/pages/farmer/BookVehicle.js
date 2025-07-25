import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const BookVehicle = () => {
  const features = [
    'Search vehicles by location, type, and capacity',
    'Filter by price range and availability',
    'View vehicle details and owner ratings',
    'Compare multiple vehicles side by side',
    'Select pickup and delivery locations',
    'Schedule pickup date and time',
    'Enter produce details and special requirements',
    'Get instant price quotes',
    'Secure booking with payment integration'
  ];

  return (
    <PlaceholderPage
      title="Book Vehicle"
      description="Find and book the perfect vehicle for transporting your farm produce"
      features={features}
      backLink="/farmer/dashboard"
      backText="Back to Farmer Dashboard"
    />
  );
};

export default BookVehicle;