import React from 'react'
import { Button, Select } from 'antd';
import './UserMap.css';

const numbers = [1, 2, 3, 4, 5];
const numbersSize = numbers.length

const { Option } = Select;

const member_list = ["MemberA", "MemberB", "MemberC", "MemberD"];
const userList = [];
for (let i = 0; i < 10; i++) {
  userList.push(<Option key={'User'+i}>{'User'+i}</Option>);
}

function handleChange(value) {
    console.log(`selected ${value}`);
}

const MemberList = ({ list }) => (
  <ul className="allList">
    {list.map(item => (
      <li className="innerList" key={item}>
          <div className="listForMembers">
              {item}
          </div>
        <Select 
            className="multipleSelection"
            mode="multiple"
            allowClear
            placeholder="None"
            onChange={handleChange}
        >
            {userList}
        </Select>
      </li>
    ))}
  </ul>
);


const UserMap = () => {
    return(
        <div className="MapContainer">
            <div className="intro">
                <b1>* { userList.length } committers are not identified as members. Please complete the mapping.</b1>
                <div className="columnNames">
                    <p>Member</p>
                    <p>Committer</p>
                </div>
            </div>

            <div className="lists">
                <MemberList name="memberList" list={member_list} />
            </div>

            <div className="button">
                <Button type="primary">Proceed</Button>
            </div>
            
        </div>
    );
}


export default UserMap