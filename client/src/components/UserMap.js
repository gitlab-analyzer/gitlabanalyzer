import React, { useEffect, useState } from "react";
import { Button, Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';
import MultipleSelect from '../components/MultipleSelect'
import MembersList from './MembersList'

const { Option } = Select;
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

const memberList = ["MemberA", "MemberB", "MemberC", "MemberD", "왜 안될까?"];

// const [selectedOpt, setSelectedOpt] = useState([]);

/*
const userList = [];
for (let i = 0; i < 10; i++) {
  userList.push(<Option key={'User'+i}>{'User'+i}</Option>);
}
*/

const userList = ["User1", "User2", "User3", "User4", "User5", "User6"]

class UserMap extends React.Component {
    state = {
      selectedItems: [],
    };
  
    
    handleChange = selectedItems => {
      this.setState({ selectedItems });
    };
    
  
    render() {
      const { selectedItems } = this.state;
      const filteredOptions = userList.filter(o => !selectedItems.includes(o));

      const selected = []

      function handleChange(value) {
        selected.push(value)
        console.log(selected)
      }

      
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
                    value={selectedItems}
                    onChange={this.handleChange}
                >
                    {filteredOptions.map(item => (
                        <Select.Option key={item} value={item}>
                        {item}
                        </Select.Option>
                    ))}
                </Select>    
            </li>
          ))}
        </ul>
      );
      */

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
          console.log('selected')
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
}


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


/*
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

    
    const MemberList = ({ list }) => (
        <ul className="allList">
          {list.map(item => (
            <li className="innerList" key={item}>
                <div className="listForMembers">
                    {item}
                </div>
                <Select 
                    size="large"
                    className="multipleSelection"
                    mode="multiple"
                    allowClear
                    placeholder="None"
                    onChange={handleChange}
                    // onSelect={handleSelect}
                    // onDeselect={handleDeselect}
                >
                    {userList}
                </Select>
            </li>
          ))}
        </ul>
    );
    

    const MemberList = ({ list }) => (
        <ul className="allList">
          {list.map(item => (
            <li className="innerList" key={item}>
                <div className="listForMembers">
                    {item}
                </div>
                <MultipleSelect/>
            </li>
          ))}
        </ul>
    );
    

    function handleSelect(value) {
        const tempSelected = []

        tempSelected.push(value)
        console.log(tempSelected)
    }

    function handleDeselect(value) {
        console.log(value)
    }

    
    function handleChange(value) {
        // var dict = [];
        var dict = {};
        
        for (var i in memberList) {
            dict[memberList[i]] = { value }
        }

        dict.memberA = {value};
        console.log(dict);
        
        // console.log(value)
        // console.log(`selected ${value}`);
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
                <Button type="primary">Proceed</Button>
            </div>
            
        </div>
    );
}
*/


export default UserMap

