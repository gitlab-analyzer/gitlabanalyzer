import React from 'react';
import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

const LanguageMultiplier = ({ languages }) => {
  const renderLanguages = () => {
    return (
      <div>
        {languages.map((lang) => (
          <div>
            <TextField
              label={lang}
              id={lang}
              defaultValue="1.0"
              className=""
              // helperText="Language"
              margin="normal"
              variant="outlined"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Language Multiplier</h1>
      <FormControl>{renderLanguages()}</FormControl>
    </div>
  );
};

export default LanguageMultiplier;
