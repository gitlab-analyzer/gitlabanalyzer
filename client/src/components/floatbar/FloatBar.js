import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Select, Button, DatePicker } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import IndividualScore from './IndividualScore.js';
import EveryoneScore from './EveryoneScore.js';
import Data from './FloatBarData.json';
import moment from 'moment';
import Settings from "./Settings.json"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ScoreCalculator from './ScoreCalculator';
import "./FloatBar.css";

import { renderToStaticMarkup } from 'react-dom/server'

var FloatBarData = Data.users;
var Dates = Settings.dates;

const { Option } = Select;
const { RangePicker } = DatePicker;
const iter1 = ["2021-01-18", "2021-02-22"];
const iter2 = ["2021-02-23", "2021-03-29"];
const iter3 = ["2021-03-30", "2021-04-26"];
function FloatBar() {


  const [user, setUser] = React.useState('everyone');
  function handleChange(value) {
    setUser(value);
  }
  var x = "one", y = "two", z= "three";
  return (
    <div className="floatbar-container">
      <div className="floatbaralign">
        {(user && user === "everyone" &&
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
              <RangePicker 
                defaultValue={[null, moment()]}
                ranges={{
                  Today: [moment(), moment()],
                  'Iteration 1': [moment(iter1[0]), moment(iter1[1])],
                  'Iteration 2': [moment(iter2[0]), moment(iter2[1])],
                  'Iteration 3': [moment(iter3[0]), moment(iter3[1])],
                }}
                showTime
                format="YYYY/MM/DD hh:mm:ss"
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="selectUser">
              <Select defaultValue="everyone" style={{ width: 150 }} onChange={handleChange}>
                <Option value="everyone">@everyone</Option>
                {FloatBarData.map((Detail) => {
                  return <Option value={Detail.username}>@{Detail.username}</Option>
                })}
              </Select>
            </div>
          </Grid>
          <Grid item xs={12}>
            <CopyToClipboard
              format = {"text/plain"}
              text = {
                renderToStaticMarkup(
                  <div>
                    {FloatBarData.map((Detail) => {
                      return (
                        <div>
                          <div>{Detail.username}</div>
                          <div>{ScoreCalculator(Detail.number_commits, Detail.lines_of_code, Detail.number_issues)}</div>
                          <div>{Detail.number_commits}</div>
                          <div>{Detail.lines_of_code}</div>
                          <div>{Detail.number_issues}</div>
                          <br/>
                        </div>
                      ); 
                    })}                  
                  </div>
                  ).replaceAll("</div><br/></div>","\n").replaceAll("<div>", "").replaceAll("</div>", "\t")
              }
            >
              <Button style={{ width: 150 }}>
                Copy
                <CopyOutlined className="copyicon" />
              </Button>              
            </CopyToClipboard>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default FloatBar;
