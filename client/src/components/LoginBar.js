import React, { useState } from 'react';
import { Paper, Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import useStyles from './BarStyles';
import './SearchBar.css';
import { useAuth } from '../context/AuthContext';

const LoginBar = () => {
  const [value, setValue] = useState('');
  const classes = useStyles();

  const { user, setUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      console.log('Logged in');
    } else {
      console.log('Not logged in');
      const userInfo = await logIn();
      if (value === userInfo.token) {
        console.log('Log in Successful');
        setUser(userInfo);
      } else {
        console.log('Incorrect token');
      }
    }
  };

  // Test Example Login function
  const logIn = () => {
    return {
      userId: 'bfraser',
      token: 'klAS8jk2ao0z8',
      time: '02/08/2021',
    };
  };

  return (
    <div className="main">
      <div className="bar_container">
        <form className="flex" onSubmit={handleSubmit}>
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
              placeholder="Personal Token"
              inputProps={{ 'aria-label': 'personal token' }}
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
