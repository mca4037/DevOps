import React from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUsers, FaTruck, FaClipboardList, FaChartBar, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">
            Admin Dashboard - {user?.name}
            <small className="text-muted ms-2">(System Administrator)</small>
          </h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaUsers size={40} className="text-primary mb-3" />
              <h5>User Management</h5>
              <p className="text-muted">Manage farmers and vehicle owners</p>
              <Button as={Link} to="/admin/users" variant="primary" size="sm">
                Manage Users
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaTruck size={40} className="text-success mb-3" />
              <h5>Vehicle Approval</h5>
              <p className="text-muted">Approve and manage vehicles</p>
              <Button as={Link} to="/admin/vehicles" variant="success" size="sm">
                Review Vehicles
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaClipboardList size={40} className="text-warning mb-3" />
              <h5>Booking Monitor</h5>
              <p className="text-muted">Monitor all booking activities</p>
              <Button as={Link} to="/admin/bookings" variant="warning" size="sm">
                View Bookings
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaChartBar size={40} className="text-info mb-3" />
              <h5>Analytics</h5>
              <p className="text-muted">System performance and insights</p>
              <Button as={Link} to="/admin/analytics" variant="info" size="sm">
                View Analytics
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h6 className="mb-0">Quick Stats</h6>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col xs={6} className="mb-3">
                  <h4 className="text-primary">1,234</h4>
                  <small className="text-muted">Total Users</small>
                </Col>
                <Col xs={6} className="mb-3">
                  <h4 className="text-success">567</h4>
                  <small className="text-muted">Active Vehicles</small>
                </Col>
                <Col xs={6}>
                  <h4 className="text-warning">89</h4>
                  <small className="text-muted">Pending Approvals</small>
                </Col>
                <Col xs={6}>
                  <h4 className="text-info">15,678</h4>
                  <small className="text-muted">Total Bookings</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h6 className="mb-0">Recent Activity</h6>
            </Card.Header>
            <Card.Body>
              <div className="small">
                <div className="d-flex justify-content-between mb-2">
                  <span>New user registration</span>
                  <span className="text-muted">2 min ago</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Vehicle approved</span>
                  <span className="text-muted">15 min ago</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Booking completed</span>
                  <span className="text-muted">1 hour ago</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Payment processed</span>
                  <span className="text-muted">2 hours ago</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Alert variant="info">
        <h5>Admin Panel Features</h5>
        <p>The admin panel provides comprehensive system management including:</p>
        <ul className="mb-0">
          <li><strong>User Management:</strong> View, approve, deactivate users and manage roles</li>
          <li><strong>Vehicle Approval:</strong> Review and approve vehicle registrations</li>
          <li><strong>Booking Monitoring:</strong> Real-time monitoring of all booking activities</li>
          <li><strong>Analytics & Reports:</strong> Business insights, revenue tracking, and performance metrics</li>
          <li><strong>System Configuration:</strong> Manage platform settings and configurations</li>
          <li><strong>Dispute Resolution:</strong> Handle customer complaints and disputes</li>
        </ul>
      </Alert>
    </Container>
  );
};

export default AdminDashboard;