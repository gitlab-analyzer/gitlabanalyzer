import React from 'react';
import { Paper, Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import useStyles from './BarStyles';
import './SearchBar.css';

const LoginBar = () => {
  const classes = useStyles();
  return (
    <div className="main">
      <div className="bar_container">
        <Paper component="form" className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Personal Token"
            inputProps={{ 'aria-label': 'personal token' }}
          />
          <Button variant="contained" className={classes.goButton}>
            LOG IN
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default LoginBar;
