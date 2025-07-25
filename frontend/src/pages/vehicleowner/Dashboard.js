import React from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTruck, FaList, FaCalendarCheck, FaRupeeSign, FaStar } from 'react-icons/fa';

const VehicleOwnerDashboard = () => {
  const { user } = useAuth();

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">
            Welcome back, {user?.name}! 
            <small className="text-muted ms-2">(Vehicle Owner Dashboard)</small>
          </h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaTruck size={40} className="text-primary mb-3" />
              <h5>My Vehicles</h5>
              <p className="text-muted">Manage your vehicle fleet</p>
              <Button as={Link} to="/vehicle-owner/vehicles" variant="primary" size="sm">
                View Vehicles
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaCalendarCheck size={40} className="text-success mb-3" />
              <h5>Booking Requests</h5>
              <p className="text-muted">New requests from farmers</p>
              <Button as={Link} to="/vehicle-owner/booking-requests" variant="success" size="sm">
                View Requests
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaStar size={40} className="text-warning mb-3" />
              <h5>Your Rating</h5>
              <p className="text-muted">Current rating: {user?.rating?.toFixed(1) || 'N/A'}</p>
              <small className="text-muted">{user?.totalRatings || 0} reviews</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaRupeeSign size={40} className="text-info mb-3" />
              <h5>Earnings</h5>
              <p className="text-muted">Track your income</p>
              <Button variant="info" size="sm" disabled>
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Alert variant="info">
        <h5>Vehicle Owner Dashboard Features</h5>
        <p>This dashboard will include:</p>
        <ul className="mb-0">
          <li><strong>Fleet Management:</strong> Add, edit, and manage your vehicles</li>
          <li><strong>Booking Management:</strong> Accept/reject booking requests</li>
          <li><strong>Real-time Tracking:</strong> Update trip status and location</li>
          <li><strong>Earnings Dashboard:</strong> Daily, weekly, and monthly income reports</li>
          <li><strong>Customer Communication:</strong> Chat with farmers during trips</li>
          <li><strong>Performance Analytics:</strong> Trip completion rates and customer satisfaction</li>
          <li><strong>Document Management:</strong> Keep vehicle documents up to date</li>
        </ul>
      </Alert>
    </Container>
  );
};

export default VehicleOwnerDashboard;