import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';
import MultipleSelect from './MultipleSelect';

const MembersList = (props) => {
    const {
      membersList,
    } = useAuth();

    const memberList = props.list
    // const memberList = membersList.map((item) => item);

    /*
    return(
      <ul className="allList">
        {memberList.map(item => (
          <li className="innerList" key={item}>
              <div className="listForMembers">
                  {item}
              </div>
              <MultipleSelect className="multipleSelect" key={item} id={item} currentMember={item}/> 
          </li>
        ))}
    </ul>
    );
    */

    return(
      <ul className="allList">
        {memberList.map(item => (
          <li className="innerList" key={item}>
              <div className="listForMembers">
                  {item}
              </div>
              <MultipleSelect className="multipleSelect" key={item} id={item} currentMember={item}/> 
          </li>
        ))}
    </ul>
    );


}

export default MembersList