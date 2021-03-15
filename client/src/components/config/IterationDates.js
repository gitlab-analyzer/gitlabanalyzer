import React from 'react';
import { DatePicker, Form } from 'antd';
import { configSettings } from '../login/Repo';
import moment from 'moment';

const { RangePicker } = DatePicker;

function IterationDates() {
    const DateErrorMsg = 'Please input a Date Range.'
    return (
        <div>
            <h6>Iteration Duration</h6>
            <Form.Item
                label="Iteration 1"
                name="iter1"
                rules={[
                    { 
                        required: true, 
                        message: DateErrorMsg, 
                    },
                ]}
            >
                <RangePicker 
                    format="YYYY/MM/DD hh:mm:ss"
                    showTime
                    allowClear={false}
                    defaultValue={
                        (
                            configSettings.iteration.iter1end && 
                            [moment(configSettings.iteration.iter1start), moment(configSettings.iteration.iter1end)]
                        )
                    }
                    onChange={value => 
                        {
                            configSettings.iteration.iter1start = value[0].format();
                            configSettings.iteration.iter1end = value[1].format();
                        }
                    }
                />
            </Form.Item>
            <Form.Item
                label="Iteration 2"
                name="iter2"
                rules={[
                    { 
                        required: true, 
                        message: DateErrorMsg, 
                    },
                ]}
            >
                <RangePicker 
                format="YYYY/MM/DD hh:mm:ss"
                showTime
                allowClear={false}
                defaultValue={
                    (
                        configSettings.iteration.iter2end && 
                        [moment(configSettings.iteration.iter2start), moment(configSettings.iteration.iter2end)]
                    )
                }
                onChange={value => 
                    {
                        configSettings.iteration.iter2start = value[0].format();
                        configSettings.iteration.iter2end = value[1].format();
                    }
                }
                />
            </Form.Item>
            <Form.Item
                label="Iteration 3"
                name="iter3"
                rules={[
                    { 
                        required: true, 
                        message: DateErrorMsg, 
                    },
                ]}
            >
                <RangePicker 
                format="YYYY/MM/DD hh:mm:ss"
                showTime
                allowClear={false}
                defaultValue={
                    (
                        configSettings.iteration.iter3end && 
                        [moment(configSettings.iteration.iter3start), moment(configSettings.iteration.iter3end)]
                    )
                }
                onChange={value => 
                    {
                        configSettings.iteration.iter3start = value[0].format();
                        configSettings.iteration.iter3end = value[1].format();
                    }
                }
                />
            </Form.Item>
        </div>
    );
}

export default IterationDates;