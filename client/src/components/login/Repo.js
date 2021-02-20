import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const Repo = ({ repo }) => {
  return (
    <div>
      <Button
        component={Link}
        to="/overview"
        variant="contained"
        color="primary"
      >
        {repo}
      </Button>
    </div>
  );
};

export default Repo;
