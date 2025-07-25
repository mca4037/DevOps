import React from 'react';
import { Container, Row, Col, Card, Button, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaTruck, 
  FaSeedling, 
  FaHandshake, 
  FaMapMarkedAlt, 
  FaStar, 
  FaShieldAlt,
  FaUserFriends,
  FaChartLine 
} from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FaTruck className="text-primary" size={40} />,
      title: 'Find Vehicles',
      description: 'Connect with reliable vehicle owners for transporting your farm produce efficiently.'
    },
    {
      icon: <FaSeedling className="text-success" size={40} />,
      title: 'For Farmers',
      description: 'Easy booking system to transport your crops from farm to market with trusted drivers.'
    },
    {
      icon: <FaHandshake className="text-info" size={40} />,
      title: 'Reliable Partners',
      description: 'Verified vehicle owners with proper documentation and insurance coverage.'
    },
    {
      icon: <FaMapMarkedAlt className="text-warning" size={40} />,
      title: 'Real-time Tracking',
      description: 'Track your shipment in real-time and get updates on delivery status.'
    },
    {
      icon: <FaStar className="text-danger" size={40} />,
      title: 'Rating System',
      description: 'Rate and review services to maintain quality and trust in the community.'
    },
    {
      icon: <FaShieldAlt className="text-dark" size={40} />,
      title: 'Secure Platform',
      description: 'Safe and secure platform with verified users and protected transactions.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Farmers', icon: <FaSeedling /> },
    { number: '500+', label: 'Vehicle Owners', icon: <FaTruck /> },
    { number: '10000+', label: 'Successful Trips', icon: <FaChartLine /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <FaStar /> }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-3">
                Connecting Farmers with Reliable Transport
              </h1>
              <p className="lead mb-4">
                FarmTransport makes it easy for farmers to find reliable vehicle owners 
                for transporting their produce. Join our community of trusted partners 
                and grow your agricultural business.
              </p>
              
              {!isAuthenticated ? (
                <div className="d-flex gap-3 flex-wrap">
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="light" 
                    size="lg"
                    className="px-4"
                  >
                    <FaUserFriends className="me-2" />
                    Join Now
                  </Button>
                  <Button 
                    as={Link} 
                    to="/vehicles" 
                    variant="outline-light" 
                    size="lg"
                    className="px-4"
                  >
                    <FaTruck className="me-2" />
                    Find Vehicles
                  </Button>
                </div>
              ) : (
                <Button 
                  as={Link} 
                  to="/dashboard" 
                  variant="light" 
                  size="lg"
                  className="px-4"
                >
                  Go to Dashboard
                </Button>
              )}
            </Col>
            <Col lg={6} className="text-center">
              <div className="bg-white bg-opacity-10 rounded-3 p-4">
                <FaTruck size={120} className="text-white mb-3" />
                <h3>Smart Transport Solutions</h3>
                <p>For Modern Agriculture</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-5 fw-bold text-primary mb-3">Why Choose FarmTransport?</h2>
            <p className="lead text-muted">
              We provide a comprehensive platform that connects farmers with reliable transport solutions
            </p>
          </Col>
        </Row>

        <Row>
          {features.map((feature, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <Card className="h-100 shadow-sm border-0 hover-shadow">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">{feature.icon}</div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Stats Section */}
      <div className="bg-light py-5 mb-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h3 className="fw-bold mb-4">Our Impact</h3>
            </Col>
          </Row>
          <Row>
            {stats.map((stat, index) => (
              <Col md={6} lg={3} key={index} className="mb-3">
                <div className="text-center">
                  <div className="text-primary mb-2" style={{ fontSize: '2rem' }}>
                    {stat.icon}
                  </div>
                  <h2 className="fw-bold text-primary">{stat.number}</h2>
                  <p className="text-muted">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* How It Works Section */}
      <Container className="mb-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-5 fw-bold text-primary mb-3">How It Works</h2>
            <p className="lead text-muted">
              Simple steps to get your produce transported safely
            </p>
          </Col>
        </Row>

        <Row className="text-center">
          <Col md={4} className="mb-4">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '60px', height: '60px' }}>
              <span className="fw-bold fs-4">1</span>
            </div>
            <h5 className="fw-bold">Register & Verify</h5>
            <p className="text-muted">Create your account as a farmer or vehicle owner and complete verification</p>
          </Col>
          <Col md={4} className="mb-4">
            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '60px', height: '60px' }}>
              <span className="fw-bold fs-4">2</span>
            </div>
            <h5 className="fw-bold">Book & Connect</h5>
            <p className="text-muted">Search for available vehicles and book the one that fits your requirements</p>
          </Col>
          <Col md={4} className="mb-4">
            <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '60px', height: '60px' }}>
              <span className="fw-bold fs-4">3</span>
            </div>
            <h5 className="fw-bold">Track & Deliver</h5>
            <p className="text-muted">Track your shipment in real-time and get your produce delivered safely</p>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary text-white py-5">
          <Container>
            <Row className="text-center">
              <Col>
                <h2 className="mb-3">Ready to Get Started?</h2>
                <p className="lead mb-4">
                  Join thousands of farmers and vehicle owners who trust FarmTransport
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="light" 
                    size="lg"
                    className="px-4"
                  >
                    Register Now
                  </Button>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="outline-light" 
                    size="lg"
                    className="px-4"
                  >
                    Login
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default Home;