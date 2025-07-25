import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const Analytics = () => {
  const features = [
    'Revenue and financial analytics',
    'User growth and engagement metrics',
    'Booking trends and patterns',
    'Vehicle utilization statistics',
    'Geographic performance analysis',
    'Customer satisfaction reports',
    'Market penetration insights',
    'Predictive analytics dashboard',
    'Custom report generation'
  ];

  return (
    <PlaceholderPage
      title="Analytics & Reports"
      description="Comprehensive business intelligence and performance analytics"
      features={features}
      backLink="/admin/dashboard"
      backText="Back to Admin Dashboard"
    />
  );
};

export default Analytics;