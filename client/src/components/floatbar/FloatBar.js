import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Select, Button, DatePicker } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import IndividualScore from './IndividualScore.js';
import EveryoneScore from './EveryoneScore.js';
// import Data from './FloatBarData.json';
import moment from 'moment';
import "./FloatBar.css";

// var FloatBarData = Data.users;

const { Option } = Select;
const { RangePicker } = DatePicker;
const iter1 = ["2021-01-18", "2021-02-22"];
const iter2 = ["2021-02-23", "2021-03-29"];
const iter3 = ["2021-03-30", "2021-04-26"];
function FloatBar() {


  // const [user, setUser] = React.useState('everyone');
  const [sortType, setSortType] = React.useState('');
  // function sortChange(value) {
  //   setSortType(value);
  
  //   console.log(sortType);
  // }
  
  return (
    <div className="floatbar-container">
      <div className="floatbaralign">
        <EveryoneScore />
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
              />
            </div>
          </Grid>
          {/* <Grid item xs={12}>
            <div className="selectUser">
              <Select defaultValue="everyone" style={{ width: 150 }} onChange={handleChange}>
                <Option value="everyone">@everyone</Option>
                {FloatBarData.map((Detail) => {
                  return <Option value={Detail.username}>@{Detail.username}</Option>
                })}
              </Select>
            </div>
          </Grid> */}
          <Grid item xs={12}>
            <div className="selectSort">
              <Select 
                placeholder = "Sort" 
                style={{ width: 150 }} 
                onChange={value => setSortType(value)}
              >
                <Option value="Alphabetical">Alphabetical</Option>
                <Option value="Low to High">Low to High</Option>
                <Option value="High to Low">High to Low</Option>
              </Select>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Button style={{ width: 150 }}>
              Copy
              <CopyOutlined className="copyicon" />
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default FloatBar;
