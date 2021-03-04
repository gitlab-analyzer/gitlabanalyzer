import React, { useState, useEffect } from 'react';
import { fetchNames } from '../components/commits/commitData';
import CommitBar from '../components/commits/CommitBar';
import './CommitsPage.css';
import CommitsHeatBar from '../components/commits/CommitsHeatBar';
import { data } from '../components/commits/HeatData';

const CommitPage = () => {
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    const loadFakeData = async () => {
      const load = await fetchNames();
      setUserNames(['everyone', ...load]);
    };
    loadFakeData();
  }, []);

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
