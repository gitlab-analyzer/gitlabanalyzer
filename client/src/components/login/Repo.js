import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Button, Checkbox, List, Avatar } from 'antd';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Repo = ({ setAnalyzing, filteredList, setFilteredList }) => {
  const { setOverview, setCommitsList, setMergeList } = useAuth();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {}, [filteredList]);

  /**
   * Function that handles setting project ID and fetching all necessary data
   * for analysis
   * Parses all fetched data and store them in global context state
   */
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);

      // Set project ID to the users chosen ID
      // Currently it is hard coded to 2 since no other projects exist
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

      if (!projectRes.data['response']) {
        console.log('Failed to set project ID here');
        throw new Error('Set projects request failed.');
      }

      // Retrieve overview data and set to Context State
      const overviewRes = await axios.get(
        'http://localhost:5678/projects/2/overview'
      );

      if (overviewRes) {
        setOverview(overviewRes.data.users);
      }

      // Retrieve Commits List data and set them to Context State
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

      // Retrieve Merge List data and set them to Context State
      // Use by calling: mergeList and setMergeList from AuthContext
      const mergeListRes = await axios.get(
        'http://localhost:5678/projects/2/merge_request/all'
      );
      if (!mergeListRes.data['response']) {
        console.log('Failed to retrieve merge requests.');
        throw new Error('Fetch merge request failed.');
      }

      if (mergeListRes) {
        const mergeArray = mergeListRes.data.merge_request_list;
        console.log(mergeArray);
        const mergeListDone = {};

        const organizeMergeList = (item, _index) => {
          console.log(item);
          let id = item.author;
          id = id.toString();

          const mrToAppend = {
            comments: item.comments,
            createdDate: Date.parse(item.created_date),
            description: item.description,
            id: item.id,
            title: item.title,
            state: item.state,
            ignore: false,
            score: 0,
            loc: 0,
            commitsList: item.commit_list.map((item) => ({
              authorName: item.author_name,
              commitedDate: Date.parse(item.committed_date),
              id: item.id,
              title: item.title,
              ignore: false,
              score: 0,
              loc: 0,
            })),
          };

          if (id in mergeListDone) {
            // If user exists, handle data by appending
            mergeListDone[id].push(mrToAppend);
          } else {
            // Handle user object creation and append
            mergeListDone[id] = [mrToAppend];
          }
        };
        mergeArray.forEach(organizeMergeList);
        console.log('well well here it is');
        console.log(mergeListDone);
        setMergeList(mergeListDone);
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
