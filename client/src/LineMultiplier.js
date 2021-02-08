import React from 'react';
import TextField from '@material-ui/core/TextField';

const LineMultiplier = () => {
  return (
    <div>
      <div>
        <TextField
          label="Line Addition"
          id="line_addition"
          defaultValue="1.0"
          className=""
          // helperText="Language"
          margin="normal"
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          label="Line Deletion"
          id="line_deletion"
          defaultValue="0.1"
          className=""
          // helperText="Language"
          margin="normal"
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          label="Comments"
          id="comments"
          defaultValue="0.2"
          className=""
          // helperText="Language"
          margin="normal"
          variant="outlined"
        />
      </div>
    </div>
  );
};

export default LineMultiplier;
