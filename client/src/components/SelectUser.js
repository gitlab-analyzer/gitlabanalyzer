import React, { useState } from 'react';
import { Select } from 'antd';
import IndividualScore from './floatbar/IndividualScore';
import { useAuth } from '../context/AuthContext';
import './SelectUser.css';

const { Option } = Select;

function SelectUser() {
  const { selectMembersList, selectUser, setSelectUser, commitsList} = useAuth();

  const countDates = (commitsList) => {
    var result = {},
      i,
      j,
      date,
      rarr = [];
      for(i = 0; i < commitsList.length; i++) {
        if(selectUser == commitsList[i].userName){
          console.log("test passed")
          for(j = 0; j < commitsList[i].commits[0].length; j++){
            date = new Date(commitsList[i].commits[0][j].commitedDate)
            console.log(date.getFullYear())
          }
        }
      }
  }
  return (
    <div className="selectUser">
      <Select
        defaultValue={selectMembersList[0]}
        style={{ width: 200 }}
        onChange={(value) => {
          setSelectUser(value);
          countDates(commitsList)
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
