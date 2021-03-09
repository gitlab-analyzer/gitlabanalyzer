import React, { useState, useEffect } from 'react';
import '../App.css';
import '../Shared.css';
import Logo from '../components/Logo';
import SearchBar from '../components/login/SearchBar';
import { Button, Alert, Spin } from 'antd';
import { useAuth } from '../context/AuthContext';
import Repo from '../components/login/Repo';
import { LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Redirect } from 'react-router';

function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { user, setUser, setRepo } = useAuth();
  const [reList, setReList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      const repoList = await axios.get('http://localhost:5678/projects');
      console.log(repoList);
      setRepo(repoList.data.value);
      setReList([
        ...repoList.data.value,
        'Administrator / Earth GitLab 373',
        'Administrator / Mars GitLab 373',
        'Administrator / Jupiter GitLab 373',
      ]);
      setFilteredList([
        ...repoList.data.value,
        'Administrator / Earth GitLab 373',
        'Administrator / Mars GitLab 373',
        'Administrator / Jupiter GitLab 373',
      ]);
      setLoading(false);
    };
    getRepos();
  }, []);

  const handleLogOut = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('user');
    setRepo(null);
    setUser(null);
  };

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
              message="Analzying selected repository"
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
          <Button
            type="primary"
            onClick={handleLogOut}
            icon={<LogoutOutlined />}
            className="logout"
            size="large"
          >
            Log Out
          </Button>
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
