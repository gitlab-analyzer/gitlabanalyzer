import React from "react";
import "./FloatBar.css";
// import "./components/Button.css";
import {Button, Select, StylesProvider /*createMuiTheme*/} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import FormControl from '@material-ui/core/FormControl';

// import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { /*makeStyles, ThemeProvider*/ } from '@material-ui/core/styles';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
// import { makeStyles } from '@material-ui/core/styles';

const SCORES = ['raw score', 'commits', 'lines of code', "issues & reviews"];
const USERS = ['bfraser', 'khangura', 'gbaker'];
const DATES = ['8/29/2021', '9/31/2021'];

// const useStyles = makeStyles((theme) => ({
//   listofusers: {    
//     backgroundColor: "#4A4F68",
    
//     height: "50px",
//     borderRadius: "10px",
//     MuiOutlinedInput: {
//       outline:"none",
//     },

//   },
//   overrides: {
//     MuiInput: {
//       // Name of the styleSheet
//       listofusers: {
//         '&:hover:not($disabled):before': {
//           // backgroundColor: theme.palette.input.MuiInput,
//           backgroundColor: theme.palette.text.primary,
//           // height: 1,
//           outline:"none",
//         },
//         '&:after': {
//           borderBottom: `2px solid red`
//         },
//       },
//     },
//   },
// }));

function FloatBar() {

  // const classes = useStyles();
  const [user, setUser] = React.useState('');

  const handleChange = (event) => {
    setUser(event.target.value);
  };

    return (
        <div className="floatbar-container">
          <ul className="floatbar-labels">
            {SCORES.map(scorename => {
              return <li>{scorename}</li>;
            })}

          </ul>
          <div className="floatbar-scores">
            <div>
              {SCORES.map(scorename => {
                return <li>{scorename}</li>;
              })}
            </div>
          </div>
          <div className="floatbar-functions">
            <Grid container className="sth" spacing={1} direction="column" justify="space-evenly"  alignItems="flex-end" >
              {/* <Box pr={3} my={2}> */}
                <Grid item xs={12}>
                  <div className="daterange">
                    {DATES[0]} - {DATES[1]}
                    {/* dates here */}
                  </div>
                </Grid>
                <Grid item xs={12}>
                  {/* <div className={classes.listofusers}> */}
                  <div className="listofusers">
                    <FormControl variant="outlined" size="small" className="selectuser" >
                      <Select value={user} onChange={handleChange} displayEmpty>
                        <MenuItem value="">
                          @everyone
                        </MenuItem>
                        {USERS.map(username => {
                          return <li><MenuItem value={username}>@{username}</MenuItem></li>;
                        })}
                      </Select>
                    </FormControl>
                  </div> 
                </Grid>
                <Grid item xs={12}>
                  <StylesProvider injectFirst>
                  {/* <ThemeProvider theme={theme}> */}
                    <Button className="copybutton" variant="outlined" size="small">
                    {/* <Button className={classes.copybutton} variant="outlined" size="small"> */}
                      <span className="copyText">Copy</span> 
                      <FileCopyOutlinedIcon className="copyicon" size="small"/>
                    </Button>
                  {/* </ThemeProvider> */}
                  </StylesProvider>              
                </Grid>              
            {/* </Box> */}
          </Grid>
            
          </div>
        </div>
    );
  
}

export default FloatBar;