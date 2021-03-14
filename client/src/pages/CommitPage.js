import React from 'react';
import CommitBar from '../components/commits/CommitBar';
import SelectUser from '../components/SelectUser';
import './CommitsPage.css';
import Header from '../components/Header';
import FooterBar from '../components/FooterBar';

const CommitPage = () => {
  return (
    <>
      <Header />
      <SelectUser />
      <div>
        <div style={{ height: '200px' }}></div>
        <CommitBar />
      </div>
      <FooterBar />
    </>
  );
};

export default CommitPage;
