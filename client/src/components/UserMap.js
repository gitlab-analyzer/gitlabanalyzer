import React, { useEffect, useState } from "react";
import { Button, Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';
import MultipleSelect from '../components/MultipleSelect'
import MembersList from './MembersList'
import { Redirect } from 'react-router';
import fetchMergeRequests from './login/Repo'
import fetchCommits from './login/Repo'
import axios from 'axios';

const { Option } = Select;

const UserMap = () => {
    const {
        membersList,
        usersList,
        selectedRepo,
        mergeRequestList,
        setMergeRequestList,
        commitsList,
        setCommitsList,
        mapList, setMapList,
        selectedOptions, 
    } = useAuth();
    const [redirect, setRedirect] = useState(false);
    const [mappingDictionary, setMappingDictionary] = useState("");

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
    
    // const mapDictionary = JSON.stringify({ "Administrator": ["jiwonj", "jaddiet", "xtran"] }); 
    // const mapDictionary = JSON.stringify(mapList);

    let mapDict = {}
    mapDict["user_mapping"] = mapList;
    let finalDict = JSON.stringify(mapDict);

    const proceedMapping = async () => {
        // var mapDictionary = JSON.stringify(mapList);
        setMappingDictionary(mapList);
        // console.log(selectedRepo)
        // console.log(mapDictionary)
        // console.log(selectedOptions.length)
        console.log(mapList);
        console.log(mapDict);
        console.log(finalDict);

        if (selectedOptions.length !== 0) {  // if there is at least one committer to be mapped
            try {
                await mapUsers();
                // Call commitsList mergeRequestList again since the data have been changed.
                await fetchCommits();
                console.log('commit change')
                await fetchMergeRequests();
                console.log('merge request change')
            } catch (error) {
                console.log(error);
            }
        }
        setRedirect(true)
    }

    // POST call to backend 
    const mapUsers = async () => {
        const userMappingRes = await axios.post(
            `http://localhost:5678/projects/${selectedRepo}/map`,
            finalDict,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                crossorigin: true,
                crossDomain: true,
            }
        );
        fetchErrorChecker(userMappingRes.data['response'], 'map');
    
    };

    const fetchErrorChecker = (res, dataType) => {
        if (!res) {
            console.log(`Failed to retrieve ${dataType} list!`);
            throw new Error('Fetch request failed.');
        }
    };
      
    if (redirect) {
        return <Redirect to="/repo" />;
    } else {
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
                    <Button type="primary" onClick={proceedMapping} setRedirect={setRedirect}>Proceed</Button>
                </div>
                
            </div>
        );
    }

}

export default UserMap

