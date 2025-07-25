import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const Profile = () => {
  return (
    <Container className="py-5">
      <Alert variant="info">
        <h4>Profile Management</h4>
        <p>This page will allow users to:</p>
        <ul>
          <li>View and edit personal information</li>
          <li>Update contact details and address</li>
          <li>Change password</li>
          <li>View profile statistics and ratings</li>
          <li>Manage role-specific settings</li>
        </ul>
      </Alert>
    </Container>
  );
};

export default Profile;