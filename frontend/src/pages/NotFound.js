import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="text-center">
        <Col>
          <div className="py-5">
            <FaExclamationTriangle size={80} className="text-warning mb-4" />
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="mb-3">Page Not Found</h2>
            <p className="lead text-muted mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button as={Link} to="/" variant="primary" size="lg">
              <FaHome className="me-2" />
              Go Home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;