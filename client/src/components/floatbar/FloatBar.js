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
    currentConfig,
  } = useAuth();
  useEffect(() => {}, []);

  let dateObj = {}  
  console.log("curr iterations", currentConfig.value.iterations)
  for(let dateprop of currentConfig.value.iterations){
    dateObj[dateprop.itername] = [dateprop.iterdates[0], dateprop.iterdates[1]]
  }

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

  let userData = barData.find(x=>x.name===selectUser)


  return (
    <listitem>
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
                  defaultValue={dataList}
                  onChange={setDataList}
                  format="YYYY/MM/DD hh:mm:ss"
                  ranges={dateObj}
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
                  text={ (userData &&
                    (
                      String(ScoreCalculator(userData.name).toFixed(0)) + '\t' +
                      userData.commits + '\t' +
                      userData.code + '\t' +
                      userData.issue
                    )) || (
                      '0\t0\t0\t0'
                    )
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
              {/* )} */}
            </Grid>
          </Grid>
        </div>
      </div>
    </listitem>
  );
}

export default FloatBar;
