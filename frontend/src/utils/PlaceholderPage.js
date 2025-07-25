import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHammer } from 'react-icons/fa';

const PlaceholderPage = ({ 
  title, 
  description, 
  features = [], 
  backLink = '/dashboard',
  backText = 'Back to Dashboard' 
}) => {
  return (
    <Container className="py-4">
      <div className="mb-3">
        <Button as={Link} to={backLink} variant="outline-secondary" size="sm">
          <FaArrowLeft className="me-2" />
          {backText}
        </Button>
      </div>

      <Alert variant="warning" className="text-center">
        <FaHammer size={50} className="mb-3" />
        <h3>{title}</h3>
        <p className="lead">{description}</p>
        
        {features.length > 0 && (
          <div className="mt-4">
            <h5>Planned Features:</h5>
            <ul className="text-start" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-4">
          <p className="mb-0">
            <strong>Status:</strong> Under Development - Coming Soon!
          </p>
        </div>
      </Alert>
    </Container>
  );
};

export default PlaceholderPage;