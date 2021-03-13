import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Button, Checkbox, List, Avatar } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Repo = ({ setAnalyzing, filteredList, setFilteredList }) => {
  const { membersList, setMembersList } = useAuth();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {}, [filteredList]);

  const fetchErrorChecker = (res, dataType) => {
    if (!res) {
      console.log(`Failed to retrieve ${dataType} list!`);
      throw new Error('Fetch request failed.');
    }
  };

  // Function for fetching members list data
  const fetchMembers = async () => {
    const membersRes = await axios.get(
      'http://localhost:5678/projects/2/members'
    );
    console.log(membersRes);

    fetchErrorChecker(membersRes.data['response'], 'members');
  };

  // Function for fetching users list data
  const fetchUsers = async () => {
    const usersRes = await axios.get('http://localhost:5678/projects/2/users');
    console.log(usersRes);

    fetchErrorChecker(usersRes.data['response'], 'users');
  };

  /**
   * Function that handles setting project ID and fetching all necessary data
   * for analysis
   * Parses all fetched data and store them in global context state
   */
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);

      // This part is important, it is needed for iteration 3, but this process calls
      // an API in the backend that currently takes a long time.
      // This call is disabled for the demo on Monday.

      // Set project ID to the users chosen ID
      // Currently it is hard coded to 2 since no other projects exist
      // const projectRes = await axios.post(
      //   'http://localhost:5678/projects/set',
      //   {},
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Access-Control-Allow-Origin': '*',
      //     },
      //     params: {
      //       projectID: 2,
      //     },
      //   }
      // );
      // if (projectRes.data['response'] !== true) {
      //   console.log('Failed to set project ID here');
      //   throw new Error('Fetch request failed.');
      // }

      await fetchMembers();
      await fetchUsers();

      setAnalyzing(false);
      setRedirect(true);
    } catch (error) {
      setAnalyzing(false);
      console.log(error);
    }
  };

  if (redirect) {
    return <Redirect to="/summary" />;
  } else {
    return (
      <div>
        <List
          style={{ marginTop: '20px' }}
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={filteredList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="details">Details</Button>,
                <Button onClick={handleAnalyze} key="analyze">
                  Analyze
                </Button>,
                <Checkbox>Batch</Checkbox>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    src="https://cdn4.iconfinder.com/data/icons/logos-and-brands-1/512/144_Gitlab_logo_logos-512.png"
                  />
                }
                title={item}
                description="Web app for GitLab Analyzer"
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
};

export default Repo;
