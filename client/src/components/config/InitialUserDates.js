import React from 'react';
import { Select, DatePicker, Form } from 'antd';
import moment from 'moment';
import { configSettings } from '../login/Repo';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;

const { RangePicker } = DatePicker;

function InitialUserDates() {
  const { selectMembersList, selectUser, setSelectUser, anon } = useAuth();

  let anonList = Array.from(
    selectMembersList,
    (x) => `user${selectMembersList.indexOf(x)}`
  );
  return (
    <div>
      <Form.Item
        label="User"
        name="user"
        rules={[
          {
            required: true,
            message: 'Please choose a User.',
          },
        ]}
      >
        <Select
          style={{ width: 200 }}
          defaultValue={(selectUser && selectUser)}
          onChange={(value) => setSelectUser(selectMembersList[value])}
          showSearch
        >
          {(anon && (
            <>
              {anonList.map((Detail, index) => {
                return <Option value={index}>{Detail}</Option>;
              })}
            </>
          )) || (
            <>
              {selectMembersList.map((Detail, index) => {
                return <Option value={index}>{Detail}</Option>;
              })}
            </>
          )}
        </Select>
      </Form.Item>
      <Form.Item
        label="Dates"
        name="date"
        rules={[
          {
            required: true,
            message: 'Please choose a Date Range.',
          },
        ]}
      >
        <div className="daterange">
          <RangePicker
            format="YYYY/MM/DD hh:mm:ss"
            ranges={{
              Today: [moment().startOf('day'), moment().endOf('day')],
            }}
            showTime
            allowClear={false}
            defaultValue={
              configSettings.enddate && [
                moment(configSettings.startdate),
                moment(configSettings.enddate),
              ]
            }
            onChange={(value) => {
              configSettings.startdate = value[0].format();
              configSettings.enddate = value[1].format();
            }}
            renderExtraFooter={() => 'Format: YYYY/MM/DD hh:mm:ss'}
          />
        </div>
      </Form.Item>
    </div>
  );
}
export default InitialUserDates;
