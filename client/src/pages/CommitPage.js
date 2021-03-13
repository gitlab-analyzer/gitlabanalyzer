import React from 'react';
import CommitBar from '../components/commits/CommitBar';
import SelectUser from '../components/SelectUser';
import './CommitsPage.css';

const CommitPage = () => {
  return (
    <>
      <SelectUser />
      <div>
        <div style={{ height: '200px' }}></div>
        <CommitBar />
      </div>
    </>
  );
};

export default CommitPage;
