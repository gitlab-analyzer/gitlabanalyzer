import React, { useEffect, useState } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import LoginBar from '../components/login/LoginBar';
import SearchBar from '../components/login/SearchBar';
import { useAuth } from '../context/AuthContext';
import { Button, Alert, Layout, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Repo from '../components/login/Repo';

const { Content } = Layout;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { user, setUser, repo, setRepo, incorrect } = useAuth();

  useEffect(() => {
    if (sessionStorage.getItem('user')) {
      setUser(sessionStorage.getItem('user'));
    }
  }, [user, setUser]);

  const handleLogOut = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('user');
    setRepo(null);
    setUser(null);
  };

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

  const disclaimerContainer = !user ? (
    <div>
      <p style={{ textAlign: 'center', margin: 'auto' }}>
        Disclaimer: This is a development mode application. Please only use the
        provided GitLab token and URL to test the application.{' '}
      </p>
    </div>
  ) : null;

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
          {/* {disclaimerContainer} */}
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
