import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';
import MultipleSelect from './MultipleSelect';

const memberList = ["MemberA", "MemberB", "MemberC", "MemberD"];

/*
class MembersList extends React.Component {
  render() {
    return(
        <ul className="allList">
          {memberList.map(item => (
            <li className="innerList" key={item}>
                <div className="listForMembers">
                    {item}
                </div>
                <MultipleSelect/>
            </li>
          ))}
        </ul>
      );
  }
}
*/

// this version
const MembersList = (props) => {
    const {
      membersList,
    } = useAuth();

    const memberList = props.list
    // const memberList = membersList.map((item) => item);

    return(
      <ul className="allList">
        {memberList.map(item => (
          <li className="innerList" key={item}>
              <div className="listForMembers">
                  {item}
              </div>
              <MultipleSelect key={item} id={item} currentMember={item}/>
          </li>
        ))}
    </ul>
    );


}

/*
const MembersList = ({ list }) => (
  <ul className="allList">
    {list.map(item => (
      <li className="innerList" key={item}>
          <div className="listForMembers">
              {item}
          </div>
          <MultipleSelect key={item} id={item} currentMember={item}/>
      </li>
    ))}
  </ul>
);
*/

export default MembersList