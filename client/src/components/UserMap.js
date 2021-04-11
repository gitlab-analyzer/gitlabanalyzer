import React, { useEffect, useState } from "react";
import { Button, Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';
import MultipleSelect from '../components/MultipleSelect'
import MembersList from './MembersList'

const { Option } = Select;

const UserMap = () => {
    const {
        membersList,
        setMembersList,
        usersList,
        setUsersList,
        selectedRepo,
        mergeRequestList,
        setMergeRequestList,
        commitsList,
        setCommitsList,
        mapList, setMapList,
    } = useAuth();

    // const memberList = ["MemberA", "MemberB", "MemberC", "MemberD"]; // fake data
    const memberList = membersList.map((item) => item.name);    // real data
    const userList = usersList.filter(val => !memberList.includes(val));
    
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
        console.log(mapList)
        console.log(selectedRepo)
    }
    
    /*
    const proceedMapping = async () => {
        await mapUsers();
    }

    // POST call to backend 
    const mapUsers = async () => {
        axios.defaults.withCredentials = true;

        const projectRes = await axios.post(
        `http://localhost:5678/projects/${selectedRepo}/map`,
        {
            withCredentials: true,
        }
        );
    
    };
    */

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
                <MembersList list={memberList} />
            </div>

            <div className="button">
                <Button type="primary" onClick={proceedMapping}>Proceed</Button>
            </div>
            
        </div>
    );
}

export default UserMap

