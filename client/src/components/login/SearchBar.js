import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { Input } from 'antd';
import useStyles from './BarStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const { Search } = Input;

const SearchBarComp = () => {
  const [value, setValue] = useState('');
  const [reList, setReList] = useState([]);

  const { user, repo, setRepo } = useAuth();
  const classes = useStyles();

  useEffect(() => {
    const getRepos = async () => {
      const repoList = await axios.get('http://localhost:5678/getProjectList');
      console.log(repoList);
      setRepo(repoList.data.value);
      setReList([
        repoList.data.value,
        'Administrator / Earth GitLab 373',
        'Administrator / Mars GitLab 373',
        'Administrator / Jupiter GitLab 373',
      ]);
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
