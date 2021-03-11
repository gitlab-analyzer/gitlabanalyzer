import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Button, Checkbox, List, Avatar } from 'antd';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Repo = ({ setAnalyzing, filteredList, setFilteredList }) => {
  const { setOverview, setCommitsList } = useAuth();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {}, [filteredList]);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const projectRes = await axios.post(
        'http://localhost:5678/projects/set',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          params: {
            projectID: 2,
          },
        }
      );
      if (projectRes.data['response'] !== true) {
        console.log('Failed to set project ID here');
        throw new Error('Fetch request failed.');
      }

      const overviewRes = await axios.get(
        'http://localhost:5678/projects/2/overview'
      );
      if (overviewRes) {
        setOverview(overviewRes.data.users);
      }
      const commitsRes = await axios.get(
        'http://localhost:5678/projects/2/commit'
      );
      if (commitsRes) {
        const commitsArray = commitsRes.data.commit_list;

        setCommitsList(
          commitsArray.map((commit) => ({
            authorName: commit.author_name,
            commitedDate: new Date(commit.committed_date),
            committerName: commit.committer_name,
            id: commit.id,
            title: commit.title,
          }))
        );
      }

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
