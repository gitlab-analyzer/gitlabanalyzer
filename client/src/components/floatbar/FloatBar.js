import React, { useEffect } from 'react';
import { Select, Button, DatePicker, notification } from 'antd';
import { CheckCircleOutlined, CopyOutlined, ScanOutlined } from '@ant-design/icons';
import { configSettings } from '../login/Repo.js';
import { useAuth } from '../../context/AuthContext';
import EveryoneScore, { ScoreCalculator, barData, FillBarData } from './EveryoneScore.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';


import './FloatBar.css';

var IterationDates = configSettings.iteration;

const { Option } = Select;
const { RangePicker } = DatePicker;

const copySuccessful = () => {
  notification.open({
    message: 'Copy Successful!',
    icon: <CheckCircleOutlined style={{ color: '#00D100' }} />,
    duration: 1,
  });
};

function FloatBar() {
  const [ sortType, setSortType ] = React.useState('alpha');
  // const [dateRange, setDateRange] = React.useState([configSettings.startdate, configSettings.enddate]);
  // const [ dateRange, setDateRange ] = React.useState([]);
  
  const {
    membersList,
    usersList,
    commitsList,
    notesList,
    mergeRequestList,
    commentsList,
    selectUser,
    dataList,
    setDataList,
  } = useAuth();
  useEffect(() => {}, []);

  const handleSort = (value) => {
    setSortType(value)
    if (value === "alpha"){
      barData.sort((a,b) => (a.name > b.name) ? 1 : -1)
    }
    else if (value === "low"){
      barData.sort((a,b) => (ScoreCalculator(a.name) > ScoreCalculator(b.name)) ? 1 : -1)
    }
    else if (value === "high"){
      barData.sort((a,b) => (ScoreCalculator(a.name) < ScoreCalculator(b.name)) ? 1 : -1)     
    }
  }

  const handleDate = (value) => {
    configSettings.startdate = value[0]
    configSettings.enddate = value[1]
    setDataList(value)
  }
  // console.log(barData.find(x=>x.name==="Administrator"))
  // useEffect(() => {
  //   configSettings.startdate = dateRange[0]
  //   configSettings.enddate = dateRange[1]
  //   console.log(dateRange)
  //   // setDateRange(value)   
  // },[dateRange])
  // console.log(barData)
  // useEffect(() => {
  //   console.log('in use effect')
  //   // FillBarData()
  //   EveryoneScore()
  //   .then(data =>
  //     setDataList(data)
  //   );
  // },[])
  let userData = barData.find(x=>x.name===selectUser)


  return (
    <>
      <div className="floatbar-header" style={{height:10, backgroundColor:'white'}} />
      <div className="floatbar-container">
        <div className="floatbaralign">
          <EveryoneScore />
        </div>
        <div className="floatbar-functions">
          <Grid
            container
            className="functionGrid"
            spacing={2}
            direction="column"
            alignItems="flex-end"
          >
            <Grid item xs={12}>
              <div className="daterange">
                <RangePicker 
                  defaultValue={[moment(configSettings.startdate), moment(configSettings.enddate)]}
                  format="YYYY/MM/DD hh:mm:ss"
                  allowClear={false}
                  // onChange={(value) => {
                  //   configSettings.startdate = value[0]
                  //   configSettings.enddate = value[1]
                  //   setDateRange(value)
                  // }}
                  onChange={handleDate}
                  // onChange={value => setDateRange(value)}
                  ranges={{
                    Today: [moment().startOf('day'), moment().endOf('day')],
                    'Iteration 1': [
                      moment(IterationDates.iter1start), 
                      moment(IterationDates.iter1end)
                    ],
                    'Iteration 2': [
                      moment(IterationDates.iter2start), 
                      moment(IterationDates.iter2end)
                    ],
                    'Iteration 3': [
                      moment(IterationDates.iter2start), 
                      moment(IterationDates.iter3end)
                    ],
                  }}
                  showTime
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="selectSort">
                <Select
                  placeholder="Sort"
                  style={{ width: 150 }}
                  onChange={handleSort}
                  defaultValue="alpha"
                >
                  <Option value="alpha">Alphabetical</Option>
                  <Option value="low">Low to High</Option>
                  <Option value="high">High to Low</Option>
                </Select>
              </div>
            </Grid>
            <Grid item xs={12}>
              {userData && (
                <CopyToClipboard
                  format={'text/plain'}
                  text={          
                    String(ScoreCalculator(userData.name).toFixed(0)) + '\t' +
                    userData.commits + '\t' +
                    userData.code + '\t' +
                    userData.issue
                  }
                >
                  <Button 
                    style={{ width: 150 }} 
                    onClick={copySuccessful}
                  >
                    Copy
                    <CopyOutlined className="copyicon" />
                  </Button>
                </CopyToClipboard>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default FloatBar;
