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
    anon
  } = useAuth();
  let currUser;
  React.useEffect(()=>{
    // currUser= barData.find(x=>x.name===selectUser)
  },[selectUser])

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
        // defaultValue={(anon && "User"+currUser.id) || selectUser}
        style={{ 
          width: 200, 
          marginRight:'10px'
        }}
        onChange={(value) => {
          setSelectUser(value);
        }}
        showSearch
      >
        {/* {barData.map((Detail) => { */}
        {selectMembersList.map((Detail) => {
          return (
            // <Option value={Detail.name}>
            //   {(anon && "User"+(Detail.id)) || Detail.name}
            // </Option>
          <Option value={Detail}>{Detail}</Option>
          );
        })}
      </Select>
      <IndividualScore user={selectUser}>{selectUser}</IndividualScore>
    </div>
  );
}

export default SelectUser;
