import React from 'react';
import './SearchBar.css';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Paper, Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 500,
    margin: '0 auto',
    backgroundColor: '#F1F1F1',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    backgroundColor: '#F1F1F1',
    fontFamily: 'Comfortaa',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  goButton: {
    backgroundColor: '#E8ECF2',
  },
}));

const SearchBarComp = () => {
  const classes = useStyles();
  return (
    <div className="main">
      <div className="bar_container">
        <Paper component="form" className={classes.root} styles={{}}>
          <IconButton className={classes.iconButton} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            placeholder="Search Repo"
            inputProps={{ 'aria-label': 'search repo' }}
          />
          {/* <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton> */}
          {/* <Divider className={classes.divider} orientation="vertical" /> */}
          {/* <IconButton
            color="primary"
            className={classes.iconButton}
            aria-label="directions"
          >
            <DirectionsIcon />
          </IconButton> */}
          <Button variant="contained" className={classes.goButton}>
            GO
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default SearchBarComp;
