import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Select, Button, DatePicker } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import IndividualScore from './IndividualScore.js';
import EveryoneScore from './EveryoneScore.js';
import Data from './FloatBarData.json';
import './FloatBar.css';

var FloatBarData = Data.users;

const { Option } = Select;
const { RangePicker } = DatePicker;

function FloatBar() {
  const [user, setUser] = React.useState('everyone');

  function handleChange(value) {
    setUser(value);
  }

  return (
    <div className="floatbar-container">
      <div className="floatbaralign">
        {(user && user === 'everyone' && (
          <div>
            <EveryoneScore />
          </div>
        )) || (
          <div>
            <IndividualScore>{user}</IndividualScore>
          </div>
        )}
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
            <div className="listofusers2">
              <Select
                defaultValue="everyone"
                style={{ width: 150 }}
                onChange={handleChange}
              >
                <Option value="everyone">@everyone</Option>
                {FloatBarData.map((Detail) => {
                  return (
                    <Option value={Detail.username}>@{Detail.username}</Option>
                  );
                })}
              </Select>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Button className="copybtn" style={{ width: 150 }}>
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
