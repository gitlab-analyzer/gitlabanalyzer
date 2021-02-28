import React, { useEffect, useState } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import LoginBar from '../components/login/LoginBar';
import SearchBar from '../components/login/SearchBar';
import { useAuth } from '../context/AuthContext';
import { Button, Alert, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Repo from '../components/login/Repo';

/**
 * LoginPage loads the Login Bar component and handles the Log in authentication Logic.
 * It conditionally renders the Search Bar and Repository list if user is logged in.
 */
function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { user, setUser, repo, setRepo, incorrect } = useAuth();

  useEffect(() => {
    if (sessionStorage.getItem('user')) {
      setUser(sessionStorage.getItem('user'));
    }
  }, [user, setUser]);

  // TODO: Change to cookie based authentication
  const handleLogOut = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('user');
    setRepo(null);
    setUser(null);
  };

  /**
   * Component to show loading animation
   */
  const loadingContainer = () => {
    if (loading) {
      return (
        <div style={{ margin: '50px' }}>
          <Spin tip="Loading ...">
            <Alert
              message="Loading repository list"
              description="Please wait while we retrieve your repository information."
              type="info"
            />
          </Spin>
        </div>
      );
    } else if (analyzing && user) {
      return (
        <div style={{ margin: '50px' }}>
          <Spin tip="Analyzing...">
            <Alert
              message="Analzying selected repository"
              description="Please wait while we analyze your selected repository."
              type="info"
            />
          </Spin>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="App">
      <div className="main_container">
        <div className="center">
          <div className="m-bot">
            <Logo />
          </div>
          {user ? (
            <Button
              onClick={handleLogOut}
              icon={<LogoutOutlined />}
              style={{ float: 'right' }}
              size="large"
            >
              Log Out
            </Button>
          ) : null}
          {user ? <SearchBar setLoading={setLoading} /> : <LoginBar />}
          {loadingContainer()}
          {repo ? <Repo setAnalyzing={setAnalyzing} repo={repo} /> : null}
          {incorrect ? (
            <Alert
              message="Access token or url wrong, please try again"
              type="error"
              showIcon
            />
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
