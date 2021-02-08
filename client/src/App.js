import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import LanguageMultiplier from './LanguageMultiplier';
import LineMultiplier from './LineMultiplier';

function App() {
  return (
    <div className="App">
      <LanguageMultiplier
        languages={['Java', 'Python', 'JavaScript', 'Rust', 'HTML', 'CSS']}
      />
      <br />
      <LineMultiplier />
    </div>
  );
}

export default App;
