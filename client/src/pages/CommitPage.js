import React from 'react';
import CommitBar from '../components/commits/CommitBar';
import SelectUser from '../components/SelectUser';
import './CommitsPage.css';
import Header from '../components/Header';
import FooterBar from '../components/FooterBar';
import Drawer from 'rc-drawer';

const CommitPage = () => {
  return (
    <>
      <Header />
      <SelectUser />
      <div>
        <CommitBar />
      </div>
      <FooterBar />
    </>
  );
};

export default CommitPage;
