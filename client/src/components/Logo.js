import React from 'react';
import './Logo.css';
import logo from '../public/logo.svg';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="logo__main">
      {/* <p className="makemake">makemake</p> */}
      <div className="logo__container">
        <img src={logo} className="logo" alt="logo" />
        <h1 className="title">
          <Link style={{ color: '#2A2C36' }} to="/reposearch">
            gitlab.analyzer
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default Logo;
