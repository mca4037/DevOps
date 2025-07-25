import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const BookingRequests = () => {
  const features = [
    'View new booking requests from farmers',
    'Accept or reject requests with reasons',
    'Negotiate pricing and terms',
    'View farmer profiles and ratings',
    'Route optimization suggestions',
    'Automatic matching based on preferences',
    'Bulk actions for multiple requests',
    'Communication with farmers',
    'Calendar integration for scheduling'
  ];

  return (
    <PlaceholderPage
      title="Booking Requests"
      description="Manage incoming booking requests from farmers"
      features={features}
      backLink="/vehicle-owner/dashboard"
      backText="Back to Vehicle Owner Dashboard"
    />
  );
};

export default BookingRequests;