import React from 'react';
import PlaceholderPage from '../../utils/PlaceholderPage';

const VehicleApproval = () => {
  const features = [
    'Review pending vehicle registrations',
    'Verify vehicle documents and photos',
    'Approve or reject vehicle applications',
    'View vehicle owner information',
    'Document compliance checking',
    'Insurance and permit validation',
    'Vehicle inspection scheduling',
    'Communication with vehicle owners',
    'Bulk approval/rejection actions'
  ];

  return (
    <PlaceholderPage
      title="Vehicle Approval"
      description="Review and approve vehicle registrations and documentation"
      features={features}
      backLink="/admin/dashboard"
      backText="Back to Admin Dashboard"
    />
  );
};

export default VehicleApproval;