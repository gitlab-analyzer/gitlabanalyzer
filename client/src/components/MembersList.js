import React from 'react';
import './UserMap.css';
import MultipleSelect from './MultipleSelect';

const MembersList = (props) => {
    const memberList = props.list;
    
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