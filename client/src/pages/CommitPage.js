import React, { useState } from 'react';
import CommitBar from '../components/commits/CommitBar';
import './CommitsPage.css';
import Header from '../components/Header';
import FooterBar from '../components/FooterBar';
import CodeDiff from './CodeDiff';

const CommitPage = () => {
  return (
    <>
      <Header />
      <div>
        <CommitBar />
      </div>
      {/* <CodeDiff /> */}
      <FooterBar />
    </>
  );
};

export default CommitPage;
