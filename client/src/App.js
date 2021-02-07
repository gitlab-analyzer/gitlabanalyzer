import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import LanguageMultiplier from './LanguageMultiplier';

function App() {
  return (
    <div className="App">
      <LanguageMultiplier
        languages={['Java', 'Python', 'JavaScript', 'Rust', 'HTML', 'CSS']}
      />
    </div>
  );
}

export default App;
