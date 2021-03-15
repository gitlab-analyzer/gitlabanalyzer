import React from 'react';
import { Select, DatePicker, Form } from 'antd';
import moment from 'moment';
import { setting } from '../login/Repo';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;

const { RangePicker } = DatePicker;

function InitialUserDates() {
    const { selectMembersList, selectUser, setSelectUser, anon } = useAuth();

    let anonList = Array.from((selectMembersList), x => `user${selectMembersList.indexOf(x)}`)
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
                    defaultValue={selectUser}
                    onChange={value => setSelectUser(value)}
                    showSearch
                >
                    {
                        ( anon && 
                          <>
                            {anonList.map((Detail) => {
                                return <Option value={Detail}>{Detail}</Option>
                            })}
                          </>  
                        )
                        || (
                            <>
                                {selectMembersList.map((Detail) => {
                                    return <Option value={Detail}>{Detail}</Option>
                                })}

                            </>
                        )
                    }
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
                        allowClear={false}
                        defaultValue={(setting.enddate && [moment(setting.startdate), moment(setting.enddate)])}
                        onChange={value => 
                            {
                                setting.startdate = value[0].format()
                                setting.enddate = value[1].format()                        
                            }
                        }
                        renderExtraFooter={() => 'Format: YYYY/MM/DD hh:mm:ss'}
                    />
                </div>
            </Form.Item>
        </div>
    );
}
export default InitialUserDates;