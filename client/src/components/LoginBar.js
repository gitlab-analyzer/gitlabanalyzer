import React, { useState } from 'react';
import { Paper, Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import useStyles from './BarStyles';
import './SearchBar.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginBar = () => {
  const [token, setToken] = useState('');
  const [url, setUrl] = useState('');
  const classes = useStyles();

  const { user, setUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      console.log('Logged in');
    } else {
      console.log('Not logged in');
      const userInfo = await logIn();
      console.log(userInfo);
      // if (token === userInfo.token) {
      //   console.log('Log in Successful');
      //   setUser(userInfo);
      // } else {
      //   console.log('Incorrect token');
      // }
    }
  };

  // Test Example Login function
  const logIn = async () => {
    const bodyFormData = new FormData();
    bodyFormData.append('token', token);
    bodyFormData.append('url', url);
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5000/auth',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  };

  return (
    <div className="main">
      <div className="bar_container">
        <form onSubmit={handleSubmit}>
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
              }}
              placeholder="Personal Token"
              inputProps={{ 'aria-label': 'personal token' }}
            />
          </Paper>
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
              }}
              placeholder="gitlab url"
              inputProps={{ 'aria-label': 'gitlab url' }}
            />
          </Paper>
          <Button
            type="submit"
            variant="contained"
            className={classes.goButton}
          >
            LOG IN
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginBar;
