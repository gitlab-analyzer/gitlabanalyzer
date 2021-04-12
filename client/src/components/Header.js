import React, { useEffect } from 'react';
import { Navbar, Nav, Link } from 'react-bootstrap';
import { BackTop, Affix } from 'antd';
import { UpCircleOutlined } from '@ant-design/icons';
import { LinkContainer } from 'react-router-bootstrap';
import SelectUser from '../components/SelectUser';
import FloatBar from './floatbar/FloatBar';
import Logo from './Logo';
import './Header.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Header = () => {
  const { setUserMapped, userMapped, selectedRepo } = useAuth();

  useEffect(() => [selectedRepo]);

  const handleReset = async () => {
    const resetMap = await axios.post(
      `http://localhost:5678/projects/${selectedRepo}/map/reset`,
      {
        withCredentials: true,
      }
    );
    console.log(resetMap);
    setUserMapped(false);
  };
  return (
    <div>
      <Logo />
      <BackTop
        style={{ fontSize: '40px', color: '#808080' }}
        visibilityHeight={200}
      >
        <UpCircleOutlined />
      </BackTop>
      <FloatBar />
      <Affix>
        <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer className="marginRight" to="/summary">
                <Nav.Link>Summary</Nav.Link>
              </LinkContainer>
              <LinkContainer className="marginRight" to="/newpage">
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
              {userMapped ? (
                <Nav.Link onClick={handleReset}>Reset Mapping</Nav.Link>
              ) : (
                <LinkContainer className="marginRight" to="/usermap">
                  <Nav.Link>User Mapping</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <SelectUser />
      </Affix>
    </div>
  );
};

export default Header;
