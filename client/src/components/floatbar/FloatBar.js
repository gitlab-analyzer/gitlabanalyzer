import React, { useEffect } from 'react';
import { Select, Button, DatePicker, notification } from 'antd';
import { CheckCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { configSettings } from '../login/Repo.js';
import { useAuth } from '../../context/AuthContext';
import EveryoneScore, { ScoreCalculator, barData } from './EveryoneScore.js';
import { renderToStaticMarkup } from 'react-dom/server'
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
  const [sortType, setSortType] = React.useState('alpha');
  // const [dateRange, setDateRange] = React.useState([configSettings.startdate, configSettings.enddate]);
  const [dateRange, setDateRange] = React.useState([]);
  const {
    membersList,
    usersList,
    commitsList,
    notesList,
    mergeRequestList,
    commentsList,
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
    console.log(value)
    setDateRange(value)
  }

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
              <CopyToClipboard
                format={'text/plain'}
                text={
                  '\tWeighted Score\tNumber of Commits\tLines of Code\tIssues & Reviews\n' +            
                  renderToStaticMarkup(
                    <div>
                      {barData.map((Detail) => {
                        return (
                          <div>
                            <div>{Detail.name}</div>
                            <div>{ScoreCalculator(Detail.name).toFixed(0)}</div>
                            <div>{Detail.commits}</div>
                            <div>{Detail.code}</div>
                            <div>{Detail.issue}</div>
                            {/* <br/> */}
                          </div>
                        ); 
                      })}                  
                    </div>
                    ).replaceAll('</div><div><div>', '\n')
                    .replaceAll('</div><div>', '\t')
                    .replaceAll('</div>', '')
                    .replaceAll('<div>', '') 
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
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default FloatBar;
