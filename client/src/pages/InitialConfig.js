import React from 'react';
import { Select, Button, DatePicker, Form, Drawer, Alert, notification } from 'antd';
import { useHistory } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import LanguagePoints from '../components/config/LanguagePoints.js';
import IterationDates from '../components/config/IterationDates.js'

// import './InitialConfig.css';

////// to delete
import Data from '../components/floatbar/FloatBarData.json';
var FloatBarData = Data.users;
const { Option } = Select;
///////

const { RangePicker } = DatePicker;

export var setting = {
    iteration: {}
}

function InitialConfig() {
    const history = useHistory();

    const [visible, setVisible] = React.useState(false);
    
    const handleRoute = () => {
        <Alert message="Error" type="error" showIcon />
        if (Object.keys(setting.iteration).length > 5 && setting.enddate){
            history.push("/summary")
        }
        else {
            notification.open({
                message: 'Error',
                description: 'Please fill out all fields.',
                icon: <CloseCircleOutlined style={{ color: 'red' }} />,
                duration: 1,
            });
        }           
    }

    const handleDrawer = () => {
        setVisible(true);
    }
    const onClose = () => {
        setVisible(false);
    };
    return (
        
        <div>
            <Button onClick={handleDrawer}>
                Drawer
            </Button>
            <Drawer
                placement="right"
                width={500}
                closable={false}
                onClose={onClose}
                visible={visible}
                title="Initial Configuration"
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button type="primary" htmlType="submit" onClick={handleRoute} >
                            Save
                        </Button>
                    </div>
                }
            >
                <Form 
                    layout="vertical"
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
                        <div className="languageContainer" style={{borderColor:"black"}}>
                            <LanguagePoints />
                        </div>
                        <div className="iterationContainer">
                            <IterationDates />
                        </div>
                </Form>
            </Drawer>
        </div>
    );
}
export default InitialConfig;


