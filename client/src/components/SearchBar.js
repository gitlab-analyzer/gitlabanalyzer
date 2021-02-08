import React from 'react';
import './SearchBar.css';
import { Paper, Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from './BarStyles';

const SearchBarComp = () => {
  const classes = useStyles();
  return (
    <div className="main">
      <div className="bar_container">
        <Paper component="form" className={classes.root}>
          <IconButton className={classes.iconButton} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            placeholder="Search Repo"
            inputProps={{ 'aria-label': 'search repo' }}
          />
          <Button variant="contained" className={classes.goButton}>
            GO
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default SearchBarComp;
