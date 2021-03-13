import React from 'react';
import { Navbar, Nav, Link } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import FloatBar from './floatbar/FloatBar';
import Logo from './Logo';
import './Header.css';

const Header = () => {
  return (
    <div>
      <Logo />
      <FloatBar />
      <Navbar bg="light" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer className="marginRight" to="/summary">
              <Nav.Link>Summary</Nav.Link>
            </LinkContainer>
            <LinkContainer className="marginRight" to="/commits">
              <Nav.Link>Commits & MRs</Nav.Link>
            </LinkContainer>
            <LinkContainer className="marginRight" to="/table">
              <Nav.Link>Issues & Reviews</Nav.Link>
            </LinkContainer>
            <LinkContainer className="marginRight" to="/batch">
              <Nav.Link>Batch Processing</Nav.Link>
            </LinkContainer>
            <LinkContainer className="marginRight" to="/config">
              <Nav.Link>Config</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
