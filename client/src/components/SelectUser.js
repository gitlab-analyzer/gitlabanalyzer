import React, { useState } from 'react';
import { Select } from 'antd';
import IndividualScore from './floatbar/IndividualScore';
import { useAuth } from '../context/AuthContext';
import { barData } from './floatbar/EveryoneScore';
import './SelectUser.css';

const { Option } = Select;

function SelectUser() {
  const { 
    selectMembersList, 
    selectUser, 
    setSelectUser,
  } = useAuth();
  React.useEffect(()=>{},[])

  return (
    <div 
      className="selectUser bgwhite" 
      style={{
        display:'flex', 
        justifyContent:'space-between',
        paddingBottom:'10px'
      }}
    >
      <Select
        defaultValue={selectUser}
        style={{ 
          width: 200, 
          marginRight:'10px'
        }}
        onChange={(value) => {
          setSelectUser(value);
        }}
        showSearch
      >
        {selectMembersList.map((Detail) => {
          return (
          <Option value={Detail}>{Detail}</Option>
          );
        })}
      </Select>
      <IndividualScore user={selectUser}>{selectUser}</IndividualScore>
    </div>
  );
}

export default SelectUser;
