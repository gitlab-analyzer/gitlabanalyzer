import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { Input } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
require('dotenv').config();

const { Search } = Input;

const SearchBarComp = ({ setLoading }) => {
  const [value, setValue] = useState('');
  const [reList, setReList] = useState([]);
  const authURL =
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_PROD_URL_BACKEND
      : process.env.REACT_APP_DEV_URL_BACKEND;

  const { user, repo, setRepo } = useAuth();

  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      const repoList = await axios.get(`${authURL}/getProjectList`);
      setRepo(repoList.data.value);
      setReList([
        repoList.data.value,
        'Administrator / Earth GitLab 373',
        'Administrator / Mars GitLab 373',
        'Administrator / Jupiter GitLab 373',
      ]);
      setLoading(false);
    };
    getRepos();
  }, [setRepo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      console.log('Logged in');
    } else {
      console.log('Logged Out');
    }
  };

  return (
    <div className="main">
      <div className="bar_container">
        <form className="flex" onSubmit={handleSubmit}>
          <Search
            style={{ width: '650px' }}
            placeholder="Search a repository"
            allowClear
            enterButton="Search"
            size="large"
            onChange={(event) => {
              setValue(event.target.value);
            }}
            // onSearch={onSearch}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBarComp;
