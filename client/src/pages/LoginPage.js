import React, { useState, useEffect } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import LoginBar from '../components/LoginBar';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { loggedIn } = useAuth();

  // For testing login functionality
  const loggedState = () => {
    if (loggedIn) {
      return <h1>Logged In</h1>;
    }
    return <h1>Logged Out</h1>;
  };

  useEffect(() => {
    console.log(loggedIn);
  }, [loggedIn]);

  return (
    <div className="App">
      <div className="main_container">
        <div className="center">
          <div className="m-bot">
            <Logo />
          </div>
          <LoginBar />
          {loggedState()}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
