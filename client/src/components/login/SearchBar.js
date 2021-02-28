import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { Input } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const { Search } = Input;

const SearchBarComp = ({ setLoading }) => {
  const [value, setValue] = useState('');
  const { user, repo, setRepo } = useAuth();

  /**
   * On component load, useffect will fetch project list from the api
   * and populate the repo context state
   */
  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      const repoList = await axios.get('http://localhost:5678/getProjectList');
      setRepo(repoList.data.value);
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
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBarComp;
