import React from "react";
import "./FloatBar.css";
// import "./components/Button.css";
import {Button, Select, StylesProvider /*createMuiTheme*/} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import FormControl from '@material-ui/core/FormControl';

import MenuItem from '@material-ui/core/MenuItem';
// import { /*makeStyles, ThemeProvider*/ } from '@material-ui/core/styles';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
// import ReactDOM from 'react-dom'
import HorizontalScroll from './Scroll'
import Data from './FloatBarData.json'

const DATES = ['8/29/2021', '9/31/2021'];

var FloatBarData = Data.users;
function FloatBar() {

  const [user, setUser] = React.useState('');
  const scrollRef = HorizontalScroll();


  const handleUserChange = (event, index) => {
    setUser(event.target.value);
  };

    return (
        <div className="floatbar-container">
          <div className="floatbar-labels">
            <div className="rawscore-label">
              raw score
            </div>
            <div className="remaining-labels">
              <div>commits</div>
              <div>lines of code</div>
              <div>issues & reviews</div>
            </div>
          </div>
          {/* <ul className="floatbar-labels">
            {SCORES.map(scorename => {
              return <li>{scorename}</li>;
            })}

          </ul> */}
          <div className="floatbar-scores" ref={scrollRef}>
              <div className="data2" >
                {FloatBarData.map((Detail, index) => {
                  return (
                    <div className="data">
                      <div className= "user">@{Detail.username}</div>
                      {/* <div spacing={5}> */}
                        <div className="userscore">{Detail.score}</div>
                        <div className="userscore_details">
                          <div>{Detail.number_commits}</div>
                          <div>{Detail.lines_of_code}</div>
                          <div>{Detail.number_issues}</div>
                        </div>

                      {/* </div> */}

                      
                    </div>

                  )
                })}
              </div> 
          </div>
          <div className="floatbar-functions">
            <Grid 
              container 
              className="sth" 
              spacing={2} 
              direction="column" 
              alignItems="flex-end" 
            >
              <Grid item xs={12}>
                <div className="daterange">
                  <div className="startdate">
                    {DATES[0]}
                  </div>
                  <div className="enddate"> 
                    {DATES[1]}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                {/* <div className={classes.listofusers}> */}
                <div className="listofusers">
                  <FormControl 
                    variant="outlined" 
                    size="small" 
                    className="selectuser" 
                  >
                    <Select 
                      value={user} 
                      onChange={handleUserChange} 
                      displayEmpty
                      className="selectlistofusers"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">
                        @everyone
                      </MenuItem>                        
                      {/* {USERS.map((username, index) => 
                        <MenuItem value={index}>@{username}</MenuItem>
                      )} */}
                      {FloatBarData.map((Detail, index) => {
                        return <MenuItem value={index}>@{Detail.username}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                </div> 
              </Grid>
              <Grid item xs={12}>
                <StylesProvider injectFirst>
                {/* <ThemeProvider theme={theme}> */}
                  <Button 
                    className="copybutton" 
                    variant="outlined" 
                    size="small"
                  >
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