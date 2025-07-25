import React from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const spinnerSize = size === 'sm' ? 'sm' : undefined;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <Row>
        <Col className="text-center">
          <Spinner animation="border" role="status" size={spinnerSize} className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-muted">{message}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingSpinner;