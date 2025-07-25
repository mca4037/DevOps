import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const VehicleSearch = () => {
  return (
    <Container className="py-5">
      <Alert variant="info">
        <h4>Vehicle Search & Browse</h4>
        <p>This page will provide:</p>
        <ul>
          <li>Search and filter vehicles by type, location, capacity</li>
          <li>Map view showing nearby vehicles</li>
          <li>Vehicle details with owner information</li>
          <li>Real-time availability status</li>
          <li>Direct booking functionality</li>
          <li>Price comparison and ratings</li>
        </ul>
      </Alert>
    </Container>
  );
};

export default VehicleSearch;