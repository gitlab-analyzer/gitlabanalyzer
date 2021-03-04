import React from 'react';
import { Select } from 'antd';
import Data from './floatbar/FloatBarData.json';
import Settings from './Settings.json';
import IndividualScore from './floatbar/IndividualScore';
import './SelectUser.css';
var FloatBarData = Data.users;

const { Option } = Select;

function SelectUser() {
    const [user, setUser] = React.useState(Settings.user);
    function handleChange(value) {
      setUser(value);
    }
    return (
        <div className="selectUser">
        <Select defaultValue={Settings.user} style={{ width: 150 }} onChange={handleChange}>
            <Option value="everyone">@everyone</Option>
            {FloatBarData.map((Detail) => {
            return <Option value={Detail.username}>@{Detail.username}</Option>
            })}
        </Select>
        <IndividualScore>{user}</IndividualScore>
        </div>
    );    
}

export default SelectUser;