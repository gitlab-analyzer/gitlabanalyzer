import React, { useState, useEffect } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import SearchBar from '../components/login/SearchBar';
import { Alert, Spin } from 'antd';
import { useAuth } from '../context/AuthContext';
import Repo from '../components/login/Repo';
import axios from 'axios';
import { Redirect } from 'react-router';
import LogOut from '../components/LogOut';

function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { user, setRepo } = useAuth();
  const [reList, setReList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      const repoList = await axios.get('http://localhost:5678/projects');
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

  const loadingContainer = () => {
    if (loading) {
      return (
        <div style={{ margin: '50px' }}>
          <Spin tip="Loading ...">
            <Alert
              message="Loading repository list"
              description="Please wait while we retrieve your repository information."
              type="info"
            />
          </Spin>
        </div>
      );
    } else if (analyzing && user) {
      return (
        <div style={{ margin: '50px' }}>
          <Spin tip="Analyzing...">
            <Alert
              message="Analyzing selected repository"
              description="Please wait while we analyze your selected repository."
              type="info"
            />
          </Spin>
        </div>
      );
    } else {
      return null;
    }
  };

  if (user) {
    return (
      <div className="main_container">
        <div className="rightalign">
          <LogOut />
        </div>
        <div className="App">
          <div className="center">
            <div className="m-bot">
              <Logo />
            </div>
            <SearchBar
              reList={reList}
              setLoading={setLoading}
              setFilteredList={setFilteredList}
              filteredList={filteredList}
            />
            {loadingContainer()}
            <Repo
              setAnalyzing={setAnalyzing}
              loading={loading}
              analyzing={analyzing}
              filteredList={filteredList}
              setFilteredList={setFilteredList}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default SearchPage;
