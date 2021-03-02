import React, { useEffect, useState } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import LoginBar from '../components/login/LoginBar';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'antd';
import { Redirect } from 'react-router';

function LoginPage() {
  const [redirect, setRedirect] = useState(false);
  const { user, setUser, incorrect } = useAuth();

  useEffect(() => {
    if (sessionStorage.getItem('user')) {
      setUser(sessionStorage.getItem('user'));
    }
  }, [user, setUser, redirect]);

  if (redirect || user) {
    return <Redirect to="/reposearch" />;
  } else {
    return (
      <div className="App">
        <div className="center">
          <div className="m-bot">
            <Logo />
          </div>
          <LoginBar setRedirect={setRedirect} />
          {incorrect ? (
            <Alert
              message="Access token or url wrong, please try again"
              type="error"
              showIcon
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default LoginPage;
