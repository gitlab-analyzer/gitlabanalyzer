import React, { useEffect } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import LoginBar from '../components/login/LoginBar';
import SearchBar from '../components/login/SearchBar';
import { useAuth } from '../context/AuthContext';
import Repo from '../components/login/Repo';

function LoginPage() {
  const { user, setUser, repo, incorrect } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(localStorage.getItem('user'));
    }
  }, [setUser]);

  // For testing login functionality
  // const loggedState = () => {
  //   if (user) {
  //     return <h1 style={{ fontSize: 16, marginTop: 10 }}>Logged In</h1>;
  //   }
  //   return <h1 style={{ fontSize: 16, marginTop: 10 }}>Logged Out</h1>;
  // };

  return (
    <div className="App">
      <div className="main_container">
        <div className="center">
          <div className="m-bot">
            <Logo />
          </div>
          {user ? <SearchBar /> : <LoginBar />}
          {/* {loggedState()} */}
          {repo ? <Repo repo={repo} /> : <p></p>}
          {incorrect ? (
            <h2 style={{ color: 'red' }}>Incorrect Token or URL.</h2>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
