import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { Select, Button, DatePicker, notification } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import EveryoneScore from './EveryoneScore.js';
import Data from './FloatBarData.json';
import moment from 'moment';
import Settings from './Settings.json';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ScoreCalculator from './ScoreCalculator';
import { CheckCircleOutlined } from '@ant-design/icons';
// import { setting } from '../../pages/InitialConfig'
import { setting } from '../login/Repo.js';
import { useAuth } from '../../context/AuthContext';

import './FloatBar.css';

var FloatBarData = Data.users;
var IterationDates = setting.iteration;
var Dates = Settings.dates;

const { Option } = Select;
const { RangePicker } = DatePicker;

const copySuccessful = () => {
  notification.open({
    message: 'Copy Successful!',
    icon: <CheckCircleOutlined style={{ color: '#00D100' }} />,
    duration: 1,
  });
};
console.log(setting)
function FloatBar() {
  const [sortType, setSortType] = React.useState('');
  const {
    membersList,
    usersList,
    commitsList,
    notesList,
    mergeRequestList,
    commentsList,
  } = useAuth();
  useEffect(() => {}, []);

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
                defaultValue={[moment(setting.startdate), moment(setting.enddate)]}
                format="YYYY/MM/DD hh:mm:ss"
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
                onChange={(value) => setSortType(value)}
              >
                <Option value="Alphabetical">Alphabetical</Option>
                <Option value="Low to High">Low to High</Option>
                <Option value="High to Low">High to Low</Option>
              </Select>
            </div>
          </Grid>
          <Grid item xs={12}>
            <CopyToClipboard
              format={'text/plain'}
              text={
                '\tWeighted Score\tNumber of Commits\tLines of Code\tIssues & Reviews\n' +
                JSON.stringify(FloatBarData)
                  .replaceAll('},{', '\r\n')
                  .replace(/[,]/g, '\t')
                  .replace(/[[{}"\]]/g, '')
                  .replace(/[^\n\t]+(?=):/g, '')
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
