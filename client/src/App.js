import React from 'react';
import './App.css';
import './Shared.css';
import Logo from './Logo';
import SearchBarComp from './SearchBar';
import LoginBar from './LoginBar';

function App() {
  return (
    <div className="App">
      <div className="main_container">
        <div className="center">
          <div className="m-bot">
            <Logo />
          </div>
          {/* <SearchBarComp /> */}
          <LoginBar />
        </div>
      </div>
    </div>
  );
}

export default App;
