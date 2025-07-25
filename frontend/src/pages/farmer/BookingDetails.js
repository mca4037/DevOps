import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const BookingDetails = () => {
  const features = [
    'Complete booking information and timeline',
    'Real-time location tracking on map',
    'Live chat with vehicle owner/driver',
    'Photo updates during transit',
    'Delivery confirmation and proof',
    'Digital invoice and payment details',
    'Rating and review submission',
    'Complaint or issue reporting',
    'Share tracking link with others'
  ];

  return (
    <PlaceholderPage
      title="Booking Details"
      description="Detailed view and tracking of your transport booking"
      features={features}
      backLink="/farmer/bookings"
      backText="Back to My Bookings"
    />
  );
};

export default BookingDetails;