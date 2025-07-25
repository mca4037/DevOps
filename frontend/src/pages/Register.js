import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const Register = () => {
  return (
    <Container className="py-5">
      <Alert variant="info">
        <h4>Registration Page</h4>
        <p>This page will contain a comprehensive registration form with:</p>
        <ul>
          <li>Role selection (Farmer, Vehicle Owner)</li>
          <li>Personal information form</li>
          <li>Address and contact details</li>
          <li>Role-specific fields (farm details, license info)</li>
          <li>Form validation and error handling</li>
        </ul>
        <p><strong>Note:</strong> For demo purposes, use the login page with provided credentials.</p>
      </Alert>
    </Container>
  );
};

export default Register;