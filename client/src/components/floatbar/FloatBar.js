import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Select, Button, DatePicker, notification } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import IndividualScore from './IndividualScore.js';
import EveryoneScore from './EveryoneScore.js';
import Data from './FloatBarData.json';
import moment from 'moment';
import Settings from "./Settings.json"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ScoreCalculator from './ScoreCalculator';
import { CheckCircleOutlined } from '@ant-design/icons';

import "./FloatBar.css";

var FloatBarData = Data.users;
var Dates = Settings.dates;

const { Option } = Select;
const { RangePicker } = DatePicker;

const copySuccessful =() =>{
  notification.open({
    message: 'Copy Successful!',
    icon: <CheckCircleOutlined style={{ color: '#00D100' }}/>,
    duration: 1,
  });
};

function FloatBar() {
  const [user, setUser] = React.useState('everyone');
  function handleChange(value) {
    setUser(value);
  }

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
                format="YYYY/MM/DD hh:mm:ss"
                ranges={{
                  Today: [moment(), moment()],
                  'Iteration 1': [moment(Dates[0].startdate), moment(Dates[0].enddate)],
                  'Iteration 2': [moment(Dates[1].startdate), moment(Dates[1].enddate)],
                  'Iteration 3': [moment(Dates[2].startdate), moment(Dates[2].enddate)],
                }}
                showTime
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
                "\tWeighted Score\tNumber of Commits\tLines of Code\tIssues & Reviews\n"+
                JSON.stringify(FloatBarData).replaceAll('},{', '\r\n')
                  .replace(/[,]/g,'\t')
                  .replace(/[[{}"\]]/g, "")
                  .replace(/[^\n\t]+(?=):/g, "")                
              }              
            >
              <Button style={{ width: 150 }} onClick={copySuccessful}>
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
