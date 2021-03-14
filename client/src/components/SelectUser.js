import React, { useState } from 'react';
import { Select } from 'antd';
import IndividualScore from './floatbar/IndividualScore';
import { useAuth } from '../context/AuthContext';
import './SelectUser.css';
import { setting } from '../pages/InitialConfig';
// var FloatBarData = Data.users;

const { Option } = Select;

function SelectUser() {
  const { selectMembersList, selectUser, setSelectUser } = useAuth();
  return (
    <div className="selectUser">
      <Select
        defaultValue={setting.user}
        style={{ width: 200 }}
        onChange={(value) => {
          setSelectUser(value);
        }}
        showSearch
      >
        {selectMembersList.map((Detail) => {
          return <Option value={Detail}>{Detail}</Option>;
        })}
      </Select>
      <IndividualScore user={selectUser}>{selectUser}</IndividualScore>
    </div>
  );
}

export default SelectUser;
