import React, { useState, useEffect } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';

function SearchPage() {
  const { loggedIn } = useAuth();

  // For testing login functionality
  const loggedState = () => {
    if (loggedIn) {
      return <h1>Logged In</h1>;
    }
    return <h1>Logged Out</h1>;
  };
  return (
    <div className="App">
      <div className="main_container">
        <div className="center">
          <div className="m-bot">
            <Logo />
          </div>
          <SearchBar />
          {loggedState()}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
