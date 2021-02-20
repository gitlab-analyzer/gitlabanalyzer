import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { Paper, Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from './BarStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const SearchBarComp = () => {
  const [value, setValue] = useState('');
  const classes = useStyles();

  const { user, setRepo } = useAuth();

  useEffect(() => {
    const getRepos = async () => {
      const repoList = await axios.get('http://localhost:5000/getProjectList');
      console.log(repoList);
      setRepo(repoList.data.value);
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
          <Paper className={classes.root}>
            <IconButton className={classes.iconButton} aria-label="searchicon">
              <SearchIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
              placeholder="Search for Repo"
              inputProps={{ 'aria-label': 'search repo' }}
            />
          </Paper>
          <Button
            type="submit"
            variant="contained"
            className={classes.goButton}
          >
            GO
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SearchBarComp;
