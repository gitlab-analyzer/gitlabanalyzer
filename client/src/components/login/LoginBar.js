import React, { useState } from 'react';
import { Paper, Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import useStyles from './BarStyles';
import './SearchBar.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const LoginBar = () => {
  const [token, setToken] = useState('');
  const [url, setUrl] = useState('');
  const classes = useStyles();

  // Global states from Context API
  const { user, setUser, setIncorrect } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      console.log('Logged in');
    } else {
      try {
        const userInfo = await logIn();
        if (userInfo.data['response'] === 'valid') {
          console.log('Log in Successful');
          setIncorrect(false);
          setUser(userInfo.data['username']);
          localStorage.setItem('user', userInfo.data['username']);
        } else {
          console.log('Incorrect token');
          setIncorrect(true);
        }
        // TODO Error handling on failed request
      } catch (err) {
        console.log(err);
      }
    }
  };

  // FOR TESTING ONLY
  // Automatically fills in the token and URL
  const handleJustLogIn = async (event) => {
    event.preventDefault();
    setToken('EJf7qdRqxdKWu1ydozLe');
    setUrl('https://cmpt373-1211-12.cmpt.sfu.ca');
  };

  // POST request to backend server
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
            className={classes.logInButton}
          >
            LOG IN
          </Button>
        </form>
        <Button
          variant="contained"
          onClick={handleJustLogIn}
          className={classes.logInButton}
        >
          FILL
        </Button>
      </div>
    </div>
  );
};

export default LoginBar;
