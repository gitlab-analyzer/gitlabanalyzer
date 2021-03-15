import React, { useState, useEffect } from 'react';
import BatchTable from '../components/batch/BatchTable';
import Header from '../components/Header';
import FooterBar from '../components/FooterBar';
import SearchBar from '../components/login/SearchBar';
import Repo from '../components/login/Repo';
import { useAuth } from '../context/AuthContext';

import axios from 'axios';

const BatchPage = () => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { user, setRepo } = useAuth();
  const [reList, setReList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      const repoList = await axios.get(
        'https://gitlabanalyzer.herokuapp.com/projects'
      );
      setRepo(repoList.data.projects);
      setReList([
        ...repoList.data.projects,
        'Admin / Polaris GitLab 373',
        'Admin / Alpha C GitLab 373',
        'Admin / Sirius GitLab 373',
        'Admin / Rigel GitLab 373',
        'Admin / Vega GitLab 373',
        'Admin / Antares Github 276',
        'Admin / Pleiades Github 276',
      ]);
      setFilteredList([
        ...repoList.data.projects,
        'Admin / Polaris GitLab 373',
        'Admin / Alpha C GitLab 373',
        'Admin / Sirius GitLab 373',
        'Admin / Rigel GitLab 373',
        'Admin / Vega GitLab 373',
        'Admin / Antares Github 276',
        'Admin / Pleiades Github 276',
      ]);
      setLoading(false);
    };
    getRepos();
  }, []);

  return (
    <>
      <Header />
      <div style={{ marginTop: '30px' }}>
        <SearchBar
          reList={reList}
          setLoading={setLoading}
          setFilteredList={setFilteredList}
          filteredList={filteredList}
        />
      </div>
      <Repo
        setAnalyzing={setAnalyzing}
        loading={loading}
        analyzing={analyzing}
        filteredList={filteredList}
        setFilteredList={setFilteredList}
      />
      <div style={{ marginTop: '30px', marginBottom: '30px' }}></div>
      <BatchTable />
      <FooterBar />
    </>
  );
};

export default BatchPage;
