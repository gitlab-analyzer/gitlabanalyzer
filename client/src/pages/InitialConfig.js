import React from 'react';
import { Select, Button, DatePicker, Form, InputNumber  } from 'antd';
// import { writeJsonFile } from 'write-json-file';
import { useHistory } from "react-router-dom";
import moment from 'moment';

////// to delete
import Data from '../components/floatbar/FloatBarData.json';
var FloatBarData = Data.users;
const { Option } = Select;
///////

const { RangePicker } = DatePicker;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

// export var setting = [
//     {
//         user: "",
//         java: "",
//         python: "",
//         startdate: "",
//         enddate: ""
//     }
// ];

export var setting = {
    user: "khangura",
    iteration: {}
}
// export const setting = {}
export let sData = {}
function InitialConfig() {

    const [JS, setJS] = React.useState('');
    const [PY, setPY] = React.useState('');
    const [DateRange, setDateRange] = React.useState('');
    const [Iter1Range, setIter1Range] = React.useState('');
    const [Iter2Range, setIter2Range] = React.useState('');
    const [Iter3Range, setIter3Range] = React.useState('');
    const history = useHistory();
    const handleRoute = () => {
            setting.java = JS
            setting.python = PY
            if (DateRange && Iter1Range && Iter2Range && Iter3Range){
                // console.log(setting.enddate)
                setting.startdate = DateRange[0].format("YYYYMMDD hhmmss")
                setting.enddate = DateRange[1].format("YYYYMMDD hhmmss")
                setting.iteration.iter1start = Iter1Range[0].format("YYYYMMDD hhmmss")
                setting.iteration.iter1end = Iter1Range[1].format("YYYYMMDD hhmmss")
                setting.iteration.iter2start = Iter2Range[0].format("YYYYMMDD hhmmss")
                setting.iteration.iter2end = Iter2Range[1].format("YYYYMMDD hhmmss")
                setting.iteration.iter3start = Iter3Range[0].format("YYYYMMDD hhmmss")
                setting.iteration.iter3end = Iter3Range[1].format("YYYYMMDD hhmmss")
                history.push("/summary")
            }
    }
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div>
            <Form
                {...layout}
                name = "Initial Configuration"
                initialValues={{ remember:true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
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
                    {/* // Temp Data */}
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
                        // defaultValue={[null, moment()]}
                        format="YYYY/MM/DD hh:mm:ss"
                        ranges={{
                            Today: [moment().startOf('day'), moment().endOf('day')]
                        }}
                        showTime
                        onChange={value => setDateRange(value)}
                        // onChange={value => setting.startdate = value[0], setting.enddate = value[1]}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    label="JavaScript"
                    name="javascript"
                    rules={[
                        { 
                            required: true, 
                            message: 'Please input a number.', 
                        },
                    ]}
                >
                    <InputNumber onChange={ value => setting.java = value} />
                </Form.Item>
                <Form.Item
                    label="Python"
                    name="python"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a number.',
                        },
                    ]}
                >
                    <InputNumber onChange={value => setting.python = value} />
                </Form.Item>
                <Form.Item
                    label="HTML"
                    name="html"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a number.',
                        },
                    ]}
                >
                    <InputNumber onChange={value => setting.html = value} />
                </Form.Item>
                <Form.Item
                    label="CSS"
                    name="css"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a number.',
                        },
                    ]}
                >
                    <InputNumber onChange={value => setting.css = value} />
                </Form.Item>
                <Form.Item
                    label="Iteration 1"
                    name="iter1"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a Date Range.',
                        },
                    ]}
                >
                    <div className="daterange">
                        <RangePicker 
                        format="YYYY/MM/DD hh:mm:ss"
                        showTime
                        onChange={value => setIter1Range(value)}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    label="Iteration 2"
                    name="iter2"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a Date Range.',
                        },
                    ]}
                >
                    <div className="daterange">
                        <RangePicker 
                        // defaultValue={[null, moment()]}
                        format="YYYY/MM/DD hh:mm:ss"
                        showTime
                        onChange={value => setIter2Range(value)}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    label="Iteration 3"
                    name="iter3"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a Date Range.',
                        },
                    ]}
                >
                    <div className="daterange">
                        <RangePicker 
                        format="YYYY/MM/DD hh:mm:ss"
                        showTime
                        onChange={value => setIter3Range(value)}
                        />
                    </div>

                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" onClick={handleRoute}>
                        Save
                    </Button>
                </Form.Item>
            </Form> 

        </div>
    );
}
export default InitialConfig;


