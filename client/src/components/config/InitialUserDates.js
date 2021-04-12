import React, { useEffect } from 'react';
import { Select, DatePicker, Form } from 'antd';
import moment from 'moment';
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
  let anonList = Array.from(
    selectMembersList,
    (x) => `user${selectMembersList.indexOf(x)}`
  );
  return (
    <div>
      <h6
        style={{ paddingBottom:10 }}
      >
        Set Date Range
      </h6>
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
            showTime
            allowClear={false}
            renderExtraFooter={() => 'Format: YYYY/MM/DD hh:mm:ss'}
          />
      </Form.Item>
    </div>
  );
}
export default InitialUserDates;
