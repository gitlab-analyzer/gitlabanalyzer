import React from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        <LinkContainer to="/overview">
        <Nav.Link>Overview</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/code">
        <Nav.Link>Commits & Code</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/table">
        <Nav.Link>Issues & Reviews</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/batch">
        <Nav.Link>Batch Processing</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/config">
        <Nav.Link>Config</Nav.Link>
        </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
