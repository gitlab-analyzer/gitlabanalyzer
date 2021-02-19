import React, { useEffect, useState } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import LoginBar from '../components/LoginBar';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { Alert, Layout, Spin } from 'antd';
import Repo from '../components/Repo';

const { Content } = Layout;

function LoginPage() {
  const { user, setUser, repo, incorrect } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(localStorage.getItem('user'));
    }
  }, [setUser]);

  // if (loading) {
  //   return (
  //     <div style={{ margin: '50px' }}>
  //       <Spin tip="Logging in...">
  //         <Alert
  //           message="Logging in"
  //           description="Please wait while we retrieve your repository information."
  //           type="info"
  //         />
  //       </Spin>
  //     </div>
  //   );
  // }

  return (
    <div className="App">
      <div className="main_container">
        <div className="center">
          <div className="m-bot">
            <Logo />
          </div>
          {user ? <SearchBar /> : <LoginBar />}
          {repo ? <Repo repo={repo} /> : null}
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
