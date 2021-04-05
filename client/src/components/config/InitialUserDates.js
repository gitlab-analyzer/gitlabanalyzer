import React, { useEffect } from 'react';
import { Select, DatePicker, Form } from 'antd';
import moment from 'moment';
import { configSettings } from '../login/Repo';
import { useAuth } from '../../context/AuthContext';


const { Option } = Select;

const { RangePicker } = DatePicker;

function InitialUserDates() {
  const { 
    selectMembersList, 
    selectUser, 
    setSelectUser, 
    anon, 
    dataList,
    setDataList
  } = useAuth();
  // useEffect(() => {}, [dataList]);
  let anonList = Array.from(
    selectMembersList,
    (x) => `user${selectMembersList.indexOf(x)}`
  );
  return (
    <div>
      <Form.Item
        label="User"
        name="user"
        initialValue={(selectUser && selectUser)}
        rules={[
          {
            required: true,
            message: 'Please choose a User.',
          },
        ]}
      >
        <Select
          style={{ width: 200 }}
          defaultValue={
            (selectUser || (setSelectUser(selectMembersList[0])))
          }
          onChange={(value) => 
            {
              setSelectUser(selectMembersList[value])
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
        initialValue={dataList}
        
        rules={[
          {
            required: true,
            message: 'Please choose a Date Range.',
          },
        ]}
      >
          <RangePicker
            format="YYYY/MM/DD hh:mm:ss"
            ranges={{
              Today: [moment().startOf('day'), moment().endOf('day')],
            }}
            defaultValue={dataList}
            onChange={setDataList}
            showTime
            allowClear={false}
            renderExtraFooter={() => 'Format: YYYY/MM/DD hh:mm:ss'}
          />
      </Form.Item>
    </div>
  );
}
export default InitialUserDates;
