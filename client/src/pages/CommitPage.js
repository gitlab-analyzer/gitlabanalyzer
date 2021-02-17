import React, { useState, useEffect } from 'react';
import { fetchNames } from '../components/commits/commitData';
import CommitBar from '../components/commits/CommitBar';
import CommitGraph from '../components/commits/CommitGraph';

const CommitPage = () => {
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    const loadFakeData = async () => {
      const load = await fetchNames();
      setUserNames([...load]);
    };
    loadFakeData();
  }, []);

  return (
    <div>
      <CommitGraph />
      <CommitBar username={userNames[0]} />
      <CommitBar username={userNames[1]} />
    </div>
  );
};

export default CommitPage;
