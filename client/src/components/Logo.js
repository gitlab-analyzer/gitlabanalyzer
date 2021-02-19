import React from 'react';
import './Logo.css';
import logo from '../public/logo.svg';

const Logo = () => {
  return (
    <div className="logo__main">
      <p className="makemake">makemake</p>
      <div className="logo__container">
        <img src={logo} className="logo" alt="logo" />
        <h1 className="title">gitlab.analyzer</h1>
      </div>
    </div>
  );
};

export default Logo;
