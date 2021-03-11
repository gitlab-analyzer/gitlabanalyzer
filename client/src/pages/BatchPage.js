import React, { useState, useEffect } from 'react';
import BatchTable from '../components/batch/BatchTable';
import SearchBar from '../components/login/SearchBar';
import Repo from '../components/login/Repo';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BatchPage = () => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { user, setUser, setRepo } = useAuth();
  const [reList, setReList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      const repoList = await axios.get('http://localhost:5678/projects');
      setRepo(repoList.data.projects);
      setReList([
        ...repoList.data.projects,
        'Administrator / Earth GitLab 373',
        'Administrator / Mars GitLab 373',
        'Administrator / Jupiter GitLab 373',
      ]);
      setFilteredList([
        ...repoList.data.projects,
        'Administrator / Earth GitLab 373',
        'Administrator / Mars GitLab 373',
        'Administrator / Jupiter GitLab 373',
      ]);
      setLoading(false);
    };
    getRepos();
  }, []);

  return (
    <div>
      {/* <div className="App"> */}
      <div style={{ marginTop: '30px', marginBottom: '30px' }}>
        <SearchBar
          reList={reList}
          setLoading={setLoading}
          setFilteredList={setFilteredList}
          filteredList={filteredList}
        />
        {/* {loadingContainer()} */}
        <Repo
          setAnalyzing={setAnalyzing}
          filteredList={filteredList}
          setFilteredList={setFilteredList}
        />
      </div>
      {/* </div> */}
      <BatchTable />
    </div>
  );
};

export default BatchPage;
