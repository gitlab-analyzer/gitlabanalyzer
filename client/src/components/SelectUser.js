import React from 'react';
import { Select } from 'antd';
import Data from './floatbar/FloatBarData.json';
import Settings from './Settings.json';
import IndividualScore from './floatbar/IndividualScore';
import './SelectUser.css';
import { setting } from '../pages/InitialConfig';
var FloatBarData = Data.users;

const { Option } = Select;

function SelectUser() {
    const [user, setUser] = React.useState(setting.user);
    return (
        <div className="selectUser">
        <Select 
            defaultValue={setting.user} 
            style={{ width: 200 }} 
            onChange={value => setUser(value)}
            showSearch
        >
            {FloatBarData.map((Detail) => {
            return <Option value={Detail.username}>{Detail.username}</Option>
            })}
        </Select>
        <IndividualScore>{user}</IndividualScore>
        </div>
    );    
}

export default SelectUser;