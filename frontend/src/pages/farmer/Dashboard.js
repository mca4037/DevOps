import React from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTruck, FaBookOpen, FaStar, FaChartLine } from 'react-icons/fa';

const FarmerDashboard = () => {
  const { user } = useAuth();

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">
            Welcome back, {user?.name}! 
            <small className="text-muted ms-2">(Farmer Dashboard)</small>
          </h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaTruck size={40} className="text-primary mb-3" />
              <h5>Book Vehicle</h5>
              <p className="text-muted">Find and book vehicles for your produce</p>
              <Button as={Link} to="/farmer/book-vehicle" variant="primary" size="sm">
                Book Now
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaBookOpen size={40} className="text-success mb-3" />
              <h5>My Bookings</h5>
              <p className="text-muted">Track your current and past bookings</p>
              <Button as={Link} to="/farmer/bookings" variant="success" size="sm">
                View Bookings
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
              <FaChartLine size={40} className="text-info mb-3" />
              <h5>Statistics</h5>
              <p className="text-muted">View your transport history</p>
              <Button variant="info" size="sm" disabled>
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Alert variant="info">
        <h5>Farmer Dashboard Features</h5>
        <p>This dashboard will include:</p>
        <ul className="mb-0">
          <li><strong>Quick Booking:</strong> Fast vehicle booking with saved preferences</li>
          <li><strong>Active Bookings:</strong> Real-time tracking of current shipments</li>
          <li><strong>Booking History:</strong> Complete history with ratings and reviews</li>
          <li><strong>Favorite Vehicles:</strong> Save trusted vehicle owners for quick rebooking</li>
          <li><strong>Expense Tracking:</strong> Monthly and yearly transport expense reports</li>
          <li><strong>Notifications:</strong> Real-time updates on booking status</li>
        </ul>
      </Alert>
    </Container>
  );
};

export default FarmerDashboard;