import React from 'react';
import CommitBar from '../components/commits/CommitBar';
import './CommitsPage.css';
import CommitsHeatBar from '../components/commits/CommitsHeatBar';
import { data } from '../components/commits/HeatData';

const CommitPage = () => {
  return (
    <div>
      <div style={{ height: '200px' }}>
        <CommitsHeatBar data={data} />
      </div>
      <CommitBar />
    </div>
  );
};

export default CommitPage;
