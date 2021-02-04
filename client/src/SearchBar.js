import React from 'react';
import { InputBase } from '@material-ui/core';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div>
      <h1>SearchBar</h1>
      <InputBase
        placeholder="Search…"
        className="searchBar"
        //   classes={{
        //     root: classes.inputRoot,
        //     input: classes.inputInput,
        //   }}
        //   inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
};

export default SearchBar;
