import React, { useEffect, useState } from "react";
import { Button, Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';
import MultipleSelect from '../components/MultipleSelect'
import MembersList from './MembersList'

const { Option } = Select;
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

const memberList = ["MemberA", "MemberB", "MemberC", "MemberD", "MemberHello"];

// const [selectedOpt, setSelectedOpt] = useState([]);

/*
const userList = [];
for (let i = 0; i < 10; i++) {
  userList.push(<Option key={'User'+i}>{'User'+i}</Option>);
}
*/

const userList = ["User1", "User2", "User3", "User4", "User5", "User6"]

/*
class UserMap extends React.Component {    
    render() {
      const selected = []

      function handleChange(value) {
        selected.push(value)
        console.log(selected)
      }
      
    //   const MemberList = ({ list }) => (
    //     <ul className="allList">
    //       {list.map(item => (
    //         <li className="innerList" key={item}>
    //             <div className="listForMembers">
    //                 {item}
    //             </div>
    //             <Select 
    //                 className="multipleSelection"
    //                 mode="multiple"
    //                 allowClear
    //                 placeholder="None"
    //                 value={selectedItems}
    //                 onChange={this.handleChange}
    //             >
    //                 {filteredOptions.map(item => (
    //                     <Select.Option key={item} value={item}>
    //                     {item}
    //                     </Select.Option>
    //                 ))}
    //             </Select>    
    //         </li>
    //       ))}
    //     </ul>
    //   );
      
    const MemberList = ({ list }) => (
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
      
      const proceedMapping = () => {
          // call backend api
      }

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
                <MembersList name="memberList" list={memberList} />
            </div>

            <div className="button">
                <Button type="primary" onClick={proceedMapping}>Proceed</Button>
            </div>
            
        </div>
        );
    }
}
*/

/*
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
*/




// this version!!!
const UserMap = () => {
    const selected = []

    const {
        membersList,
        setMembersList,
        usersList,
        setUsersList,
        mergeRequestList,
        setMergeRequestList,
        commitsList,
        setCommitsList,
        selectMembersList, setSelectMembersList
    } = useAuth();

    const userListLength = usersList.length;
    // const userList = usersList;
    // const userList = ["User1", "User2", "User3", "User4", "User5", "User6"];
    // const memberList = membersList;

    
    // const MemberList = ({ list }) => (
    //     <ul className="allList">
    //       {list.map(item => (
    //         <li className="innerList" key={item}>
    //             <div className="listForMembers">
    //                 {item}
    //             </div>
    //             <Select 
    //                 size="large"
    //                 className="multipleSelection"
    //                 mode="multiple"
    //                 allowClear
    //                 placeholder="None"
    //                 onChange={handleChange}
    //                 // onSelect={handleSelect}
    //                 // onDeselect={handleDeselect}
    //             >
    //                 {userList}
    //             </Select>
    //         </li>
    //       ))}
    //     </ul>
    // );
    
    
    const MemberList = ({ list }) => (
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

    const proceedMapping = () => {
        // call backend api
        // console.log('selected')
      console.log(membersList.length)
      console.log(membersList)
      console.log(usersList.length)
      console.log(usersList)
    }

    return(
        <div className="MapContainer">
            <div className="intro">
                <b1>* { userListLength } committers are not identified as members. Please complete the mapping.</b1>
                <div className="columnNames">
                    <p>Member</p>
                    <p>Committer</p>
                </div>
            </div>

            <div className="lists">
                <MemberList name="memberList" list={membersList} />
            </div>

            <div className="button">
                <Button type="primary" onClick={proceedMapping}>Proceed</Button>
            </div>
            
        </div>
    );
}










/*
const UserMap = () => {
    const {
        membersList,
        setMembersList,
        usersList,
        setUsersList,
        mergeRequestList,
        setMergeRequestList,
        commitsList,
        setCommitsList,
        selectMembersList, setSelectMembersList
    } = useAuth();

      
      const MemberList = ({ list }) => (
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
      
      const proceedMapping = () => {
          // call backend api
          // console.log('selected')
        console.log(mergeRequestList.length)
        console.log(mergeRequestList)
        console.log(commitsList.length)
        console.log(commitsList)

      }

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
                <MemberList name="memberList" list={memberList} />
            </div>

            <div className="button">
                <Button type="primary" onClick={proceedMapping}>Proceed</Button>
            </div>
            
        </div>
        );
    
}
*/

export default UserMap

