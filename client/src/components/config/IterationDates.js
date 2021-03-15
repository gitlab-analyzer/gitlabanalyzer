import React from 'react';
import { DatePicker, Form } from 'antd';
import { setting } from '../login/Repo';

const { RangePicker } = DatePicker;

function IterationDates() {
    const DateErrorMsg = 'Please input a Date Range.'
    return (
        <div>
            <h6>Iteration Duration</h6>
            <Form.Item
                label="Iteration 1"
                name="iter1"
            >
                <RangePicker 
                format="YYYY/MM/DD hh:mm:ss"
                showTime
                onChange={value => 
                    {
                        setting.iteration.iter1start = value[0].format();
                        setting.iteration.iter1end = value[1].format();
                    }
                }
                />
            </Form.Item>
            <Form.Item
                label="Iteration 2"
                name="iter2"
            >
                <RangePicker 
                format="YYYY/MM/DD hh:mm:ss"
                showTime
                onChange={value => 
                    {
                        setting.iteration.iter2start = value[0].format();
                        setting.iteration.iter2end = value[1].format();
                    }
                }
                />
            </Form.Item>
            <Form.Item
                label="Iteration 3"
                name="iter3"
            >
                <RangePicker 
                format="YYYY/MM/DD hh:mm:ss"
                showTime
                onChange={value => 
                    {
                        setting.iteration.iter3start = value[0].format();
                        setting.iteration.iter3end = value[1].format();
                    }
                }
                />
            </Form.Item>
        </div>
    );
}

export default IterationDates;