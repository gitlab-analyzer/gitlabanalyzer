import React, { useEffect } from 'react';
import { Select, DatePicker, Form } from 'antd';
import moment from 'moment';
import { configSettings } from '../login/Repo';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;

const { RangePicker } = DatePicker;

function InitialUserDates() {
  const { selectMembersList, selectUser, setSelectUser, anon } = useAuth();
  // useEffect (() => {
  //   const userChange = (value) => {
  //     setSelectUser(selectMembersList[value])
  //   };
  //   const dateChange = (value) => {
  //     configSettings.startdate = value[0].format();
  //     configSettings.enddate = value[1].format();
  //   };
  // }, [configSettings])
  useEffect(() => {}, [setSelectUser]);
  console.log(configSettings.name)
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
            {console.log('in initial', selectUser)}
        <Select
          style={{ width: 200 }}
          defaultValue={
            (selectUser || ((configSettings.name = selectMembersList[0])))
          }
          // onChange={userChange}
          onChange={(value) => 
            {
              setSelectUser(selectMembersList[value])
              configSettings.name = value;
            }
          }
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
            // onChange={dateChange}
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
