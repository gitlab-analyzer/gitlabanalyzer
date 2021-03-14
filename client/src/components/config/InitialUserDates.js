import React from 'react';
import { Select, DatePicker, Form } from 'antd';
import moment from 'moment';
// import { setting } from '../../pages/InitialConfig';
import { setting } from '../login/Repo.js';

import Data from '../floatbar/FloatBarData.json';
var FloatBarData = Data.users;
const { Option } = Select;
///////

const { RangePicker } = DatePicker;

function InitialUserDates() {
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
                    // defaultValue={"khangura"} ////////////////////////////////////// TEMPORARY NEED DATA STILL
                    style={{ width: 200 }} 
                    onChange={value => setting.user = value}
                    showSearch
                >
                {FloatBarData.map((Detail) => {
                    return <Option value={Detail.username}>{Detail.username}</Option>
                })}
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
                        Today: [moment().startOf('day'), moment().endOf('day')]
                    }}
                    showTime
                    // onChange={value => setDateRange(value)}
                    onChange={value => 
                        {
                            setting.startdate = value[0].format()
                            setting.enddate = value[1].format()                        
                        }
                    }
                    />
                </div>
            </Form.Item>

        </div>
    );
}
export default InitialUserDates;