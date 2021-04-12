import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';
import MembersList from './MembersList';
import { Redirect } from 'react-router';
import axios from 'axios';

const { Option } = Select;

const UserMap = () => {
  const {
    membersList,
    usersList,
    selectedRepo,
    mapList,
    selectedOptions,
    setUserMapped,
  } = useAuth();
  const [redirect, setRedirect] = useState(false);

  const memberList = membersList.map((item) => item.name);
  const userList = usersList.filter((val) => !memberList.includes(val));
  const unselectedUsers = userList.filter(
    (val) => !selectedOptions.includes(val)
  );

  let mapDict = {};
  mapDict['user_mapping'] = mapList;
  let finalDict = JSON.stringify(mapDict);

  const proceedMapping = async () => {
    if (selectedOptions.length !== 0) {
      try {
        await mapUsers();
        console.log(finalDict);
      } catch (error) {
        console.log(error);
      }
    }
    setRedirect(true);
  };

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
    setUserMapped(true);
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
    return (
      <div className="MapContainer">
        <div className="intro">
          <b1>
            * {unselectedUsers.length} committers are not identified as members.
            Please complete the mapping.
          </b1>
          <div className="columnNames">
            <div className="role">Member</div>
            <div className="role">Committer</div>
          </div>
        </div>

        <div className="lists">
          <MembersList list={memberList} />
        </div>

        <div className="button">
          <Button
            type="primary"
            onClick={proceedMapping}
            setRedirect={setRedirect}
          >
            Proceed
          </Button>
        </div>
      </div>
    );
  }
};

export default UserMap;
