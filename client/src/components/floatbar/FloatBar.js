import React, { useEffect, useState } from 'react';
import { Select, Button, DatePicker, notification } from 'antd';
import {
  CheckCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import EveryoneScore, { barData } from './EveryoneScore.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Grid from '@material-ui/core/Grid';

import './FloatBar.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const copySuccessful = () => {
  notification.open({
    message: 'Copy Successful!',
    icon: <CheckCircleOutlined style={{ color: '#00d100' }} />,
    duration: 1,
  });
};

function FloatBar() {
  const [sortType, setSortType] = useState('alpha');

  const {
    selectUser,
    dataList,
    setDataList,
    currentConfig,
  } = useAuth();
  useEffect(() => {}, []);

  let dateObj = {};
  if (currentConfig && currentConfig.iterations) {
    for (let dateprop of currentConfig.iterations) {
      dateObj[dateprop.itername] = [
        dateprop.iterdates[0],
        dateprop.iterdates[1],
      ];
    }
  }

  const handleSort = (value) => {
    setSortType(value);
    if (value === 'alpha') {
      barData.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (value === 'low') {
      barData.sort((a, b) =>
        a.weightscore > b.weightscore ? 1 : -1
      );
    } else if (value === 'high') {
      barData.sort((a, b) =>
        a.weightscore < b.weightscore ? 1 : -1
      );
    }
  };

  let userData = barData.find((x) => x.name === selectUser);

  return (
    <listitem>
      <div
        className="floatbar-header"
        style={{ height: 10, backgroundColor: 'white' }}
      />
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
                  allowClear={false}
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
                text={
                  (userData &&
                      userData.weightscore.toFixed(0) +
                      '\t' +
                      userData.cmcount +
                      '\t' +
                      userData.mrcount +
                      '\t' +
                      userData.issue) ||
                  '0\t0\t0\t0'
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
    </listitem>
  );
}

export default FloatBar;
