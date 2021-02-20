import React from "react";
import "./FloatBar.css";
// import "./components/Button.css";
import {/*Button, Select,*/ StylesProvider /*createMuiTheme*/} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import FormControl from '@material-ui/core/FormControl';

import MenuItem from '@material-ui/core/MenuItem';
// import { /*makeStyles, ThemeProvider*/ } from '@material-ui/core/styles';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
// import ReactDOM from 'react-dom';
// import HorizontalScroll from './Scroll'
import { Select, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { DatePicker, Space } from 'antd';
import IndividualScore from './IndividualScore.js';
import EveryoneScore from './EveryoneScore.js';
import Data from './FloatBarData.json';
var FloatBarData = Data.users;



const DATES = ['8/29/2021', '9/31/2021'];
const { Option } = Select;
const { RangePicker } = DatePicker;

function FloatBar() {

  const [user, setUser] = React.useState("everyone");
  // const scrollRef = HorizontalScroll();


  const handleUserChange = (event, index) => {
    setUser(event.target.value);
  };
  // function handleChange(value) {
  //   // // console.log(`selected ${value}`);
  //   setUser(value);
  //   // console.log({user});
  //   if (value === "everyone"){
  //     // console.log("inside");
  //     // return <EveryoneScore />
  //     return <EveryoneScore />
  //   }
  //   else {
  //     console.log("outside");
  //     return <IndividualScore />
  //   }

  // }


  // function EveryoneScore(prop) {
  //     return (
  //         <div className="data2" >
  //             {FloatBarData.map((Detail, index) => {
  //               console.log("inside everyone");
  //               return (
  //                     <div className="data">
  //                         <div className= "user">@{Detail.username}</div>
  //                         <div className="userscore">{Detail.score}</div>
  //                         <div className="userscore_details">
  //                             <div>{Detail.number_commits}</div>
  //                             <div>{Detail.lines_of_code}</div>
  //                             <div>{Detail.number_issues}</div>
  //                         </div>
  //                     </div>
  //                 );
  //             })}
  //         </div>             
  //     );
  // }


  function handleChange(value) {
  // // const handleChange = (event) => {
  //   if (value === "everyone"){
  //     console.log("everyone");
  //     return <div><EveryoneScore /></div>
  //   }
  //   else {
  //     console.log("not everyone");
  //     <div><IndividualScore /></div>
  //   }
    setUser(value);

  };

    return (
        <div className="floatbar-container">
          <div className="floatbaralign">
            { (user && user==="everyone" && 
              <div><EveryoneScore /></div>
              ) || (
                <div><IndividualScore>{user}</IndividualScore></div>
              )
            }            
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
                  <RangePicker />
                </div>
              </Grid>
              <Grid item xs={12}>
                {/* <div className={classes.listofusers}> */}
                <div className="listofusers2">
                <Select defaultValue="everyone" style={{ width: 150 }} onChange={handleChange}>
                  <Option value="everyone">@everyone</Option>
                  {FloatBarData.map((Detail) => {
                    return <Option value={Detail.username}>@{Detail.username}</Option>
                  })}                
                </Select>
                </div>
                {/* INSERT HERE */}

              </Grid>
              <Grid item xs={12}>
                <StylesProvider injectFirst>
                {/* <ThemeProvider theme={theme}> */}
                  <Button className="copybtn" style={{ width: 150 }}>
                    Copy
                    <CopyOutlined className="copyicon"/>
                  </Button>
                  {/* Button Code */}
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