import React from 'react';
import { Navbar as BSNavbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaTruck, FaUser, FaSignOutAlt, FaHome, FaTachometerAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isFarmer, isVehicleOwner } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <BSNavbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <BSNavbar.Brand>
            <FaTruck className="me-2" />
            FarmTransport
          </BSNavbar.Brand>
        </LinkContainer>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <FaHome className="me-1" />
                Home
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/vehicles">
              <Nav.Link>
                <FaTruck className="me-1" />
                Find Vehicles
              </Nav.Link>
            </LinkContainer>

            {isAuthenticated && (
              <LinkContainer to="/dashboard">
                <Nav.Link>
                  <FaTachometerAlt className="me-1" />
                  Dashboard
                </Nav.Link>
              </LinkContainer>
            )}

            {/* Farmer specific menu items */}
            {isFarmer() && (
              <NavDropdown title="Farmer Tools" id="farmer-dropdown">
                <LinkContainer to="/farmer/book-vehicle">
                  <NavDropdown.Item>Book Vehicle</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/farmer/bookings">
                  <NavDropdown.Item>My Bookings</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}

            {/* Vehicle Owner specific menu items */}
            {isVehicleOwner() && (
              <NavDropdown title="Vehicle Management" id="vehicle-owner-dropdown">
                <LinkContainer to="/vehicle-owner/vehicles">
                  <NavDropdown.Item>My Vehicles</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/vehicle-owner/manage-vehicles">
                  <NavDropdown.Item>Add/Edit Vehicle</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/vehicle-owner/booking-requests">
                  <NavDropdown.Item>Booking Requests</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}

            {/* Admin specific menu items */}
            {isAdmin() && (
              <NavDropdown title="Admin Panel" id="admin-dropdown">
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item>User Management</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/vehicles">
                  <NavDropdown.Item>Vehicle Approval</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/bookings">
                  <NavDropdown.Item>Booking Monitoring</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/analytics">
                  <NavDropdown.Item>Analytics</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span>
                    <FaUserCircle className="me-1" />
                    {user?.name}
                  </span>
                } 
                id="user-dropdown"
                align="end"
              >
                <LinkContainer to="/profile">
                  <NavDropdown.Item>
                    <FaUser className="me-2" />
                    Profile
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>
                    <Button variant="outline-light" size="sm">
                      Login
                    </Button>
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>
                    <Button variant="light" size="sm">
                      Register
                    </Button>
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;