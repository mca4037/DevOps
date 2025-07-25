import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const MyBookings = () => {
  const features = [
    'View all current and past bookings',
    'Real-time tracking of active shipments',
    'Booking status updates and notifications',
    'Communication with vehicle owners',
    'Rate and review completed trips',
    'Download invoices and receipts',
    'Cancel or modify upcoming bookings',
    'Filter bookings by status and date range',
    'Export booking history reports'
  ];

  return (
    <PlaceholderPage
      title="My Bookings"
      description="Track and manage all your transport bookings in one place"
      features={features}
      backLink="/farmer/dashboard"
      backText="Back to Farmer Dashboard"
    />
  );
};

export default MyBookings;