import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Tag, Button, Checkbox, List, Avatar, Progress } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Repo = ({
  analyzing,
  setAnalyzing,
  filteredList,
  setFilteredList,
  loading,
}) => {
  const {
    setMembersList,
    setUsersList,
    setCommitsList,
    setNotesList,
    setMergeRequestList,
    setCommentsList,
    setSelectMembersList,
    setSelectUser,
  } = useAuth();

  const [redirect, setRedirect] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkedList, setCheckedList] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(['members', 'users']);

  const plainOptions = ['Apple', 'Pear', 'Orange'];

  useEffect(() => {}, [filteredList]);

  // General error handling function for fetch requests
  const fetchErrorChecker = (res, dataType) => {
    if (!res) {
      console.log(`Failed to retrieve ${dataType} list!`);
      throw new Error('Fetch request failed.');
    }
  };

  // Set project ID to the users chosen ID
  // Currently it is hard coded to 2 since no other projects exist
  const setProjectId = async () => {
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
      console.log('Failed to set project ID!');
      throw new Error('Fetch request failed.');
    }
  };

  // Function for fetching members list data
  const fetchMembers = async () => {
    const membersRes = await axios.get(
      'http://localhost:5678/projects/2/members'
    );

    fetchErrorChecker(membersRes.data['response'], 'members');
    setMembersList([...membersRes.data['members']]);

    // A separate members list for controlling personal bar
    const tempMemList = [];
    for (let member of membersRes.data['members']) {
      tempMemList.push(member.name);
    }
    setSelectMembersList(tempMemList);
    setSelectUser(tempMemList[0]);
  };

  // Function for fetching users list data
  const fetchUsers = async () => {
    const usersRes = await axios.get('http://localhost:5678/projects/2/users');

    fetchErrorChecker(usersRes.data['response'], 'users');
    setUsersList([...usersRes.data['users']]);
  };

  // Function for fetching commits list data
  const fetchCommits = async () => {
    const commitsRes = await axios.get(
      'http://localhost:5678/projects/2/commit/user/all'
    );
    fetchErrorChecker(commitsRes.data['response'], 'commits');

    const tempCommits = commitsRes.data['commit_list'].map((commit) => ({
      userName: commit.user_name,
      commits: [
        commit.commits.map((innerCommit) => ({
          authorName: innerCommit.author_name,
          codeDiffId: innerCommit.code_diff_id,
          commitedDate: new Date(innerCommit.committed_date),
          commiterName: innerCommit.committer_name,
          id: innerCommit.id,
          lineCounts: {
            ...innerCommit.line_counts,
          },
          shortId: innerCommit.short_id,
          title: innerCommit.title,
          webUrl: innerCommit.web_url,
        })),
      ],
    }));
    setCommitsList([...tempCommits]);
  };

  // Function for fetching, parsing, and storing merge requests list data
  const fetchMergeRequests = async () => {
    const mergeRequestRes = await axios.get(
      'http://localhost:5678/projects/2/merge_request/user/all'
    );
    // console.log(mergeRequestRes.data['merge_request_users_list']);

    fetchErrorChecker(mergeRequestRes.data['response'], 'merge request');

    // Generate a temporary merge request list to parse and set to Global Context API
    const generateTempMR = () => {
      const mrList = mergeRequestRes.data['merge_request_users_list'];
      const tempMR = {};
      // Loop through object key
      for (let user in mrList) {
        tempMR[user] = {
          mr: [],
          weightedScore: 0,
        };
        // Loop through object item
        for (let author of mrList[user]) {
          tempMR[user].mr.push({
            author: author.author,
            codeDiffId: author.code_diff_id,
            comments: author.comments,
            commitList: [
              author.commit_list.map((commit) => ({
                authorName: commit.author_name,
                codeDiffId: commit.code_diff_id,
                comittedDate: new Date(commit.committed_date),
                committerName: commit.committer_name,
                id: commit.id,
                relatedMr: author.id,
                lineCounts: commit.line_counts,
                shortId: commit.short_id,
                title: commit.title,
                webUrl: commit.web_url,
                // Frontend defined variables Start --------------------------
                // Initial score calculation
                score:
                  commit.line_counts.lines_added +
                  commit.line_counts.lines_deleted * 0.1,
                // Flag to ignore this commit
                ignore: false,
                // Frontend defined variables End --------------------------
              })),
            ],
            createdDate: new Date(author.created_date),
            description: author.description,
            id: author.id,
            iid: author.iid,
            lineCounts: author.line_counts,
            mergedBy: author.merged_by,
            mergedDate: new Date(author.merged_date),
            relatedIssueIid: author.related_issue_iid,
            state: author.state,
            title: author.title,
            webUrl: author.web_url,
            // Frontend defined variables Start --------------------------
            // Initial score calculation
            score:
              author.line_counts.lines_added +
              author.line_counts.lines_deleted * 0.1,
            // Flag to ignore this MR
            ignore: false,
            // Frontend defined variables End --------------------------
          });
        }
      }
      return tempMR;
    };
    setMergeRequestList(generateTempMR());
  };

  // Function for fetching, parsing, and storing notes list data
  const fetchNotes = async () => {
    const notesRes = await axios.get(
      'http://localhost:5678/projects/2/comments/all'
    );

    fetchErrorChecker(notesRes.data['response'], 'notes');

    const tempNotes = notesRes.data['notes'].map((note) => ({
      author: note.author,
      body: note.body,
      createdDate: new Date(note.created_date),
      id: note.id,
      noteableId: note.noteable_id,
      noteableIid: note.noteable_iid,
      noteableType: note.noteable_type,
      wordCount: note.word_count,
      // Frontend defined variables Start --------------------------
      // Initial score calculation
      score: note.word_count * 1,
      // Flag to ignore this note
      ignore: false,
      // Frontend defined variables End --------------------------
    }));
    setNotesList([...tempNotes]);
  };

  // Function for fetching, parsing, and storing comments list data
  const fetchComments = async () => {
    const commentsRes = await axios.get(
      'http://localhost:5678/projects/2/comments/user/all'
    );
    fetchErrorChecker(commentsRes.data['response'], 'comments');
    const generateTempComments = () => {
      const commentList = commentsRes.data['notes'];
      const tempComments = {};
      for (let user in commentList) {
        tempComments[user] = [];
        for (let comment of commentList[user]) {
          tempComments[user].push({
            author: comment.author,
            body: comment.body,
            createdDate: new Date(comment.created_date),
            id: comment.id,
            noteableId: comment.noteable_id,
            noteableIid: comment.noteable_iid,
            noteableType: comment.noteable_type,
            wordCount: comment.word_count,
            // Frontend defined variables Start --------------------------
            // Initial score calculation
            score: 0,
            // Flag to ignore this comment
            ignore: false,
            // Frontend defined variables End --------------------------
          });
          tempComments[user]['weightedScore'] = 0;
        }
      }
      // console.log(tempComments);
      return tempComments;
    };
    setCommentsList(generateTempComments());
  };

  /**
   * Function that handles setting project ID and fetching all necessary data
   * for analysis
   * Parses all fetched data and store them in global context state
   */
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);

      /**
       * This setProjectIs() is important, it is needed for iteration 3, but this process calls
       * an API in the backend that currently takes a long time (2+ minutes).
       * This call is disabled for the demo on Monday.
       */

      await setProjectId();

      await fetchMembers();
      await fetchUsers();
      await fetchCommits();
      await fetchMergeRequests();
      await fetchNotes();
      await fetchComments();

      setAnalyzing(false);
      setRedirect(true);
    } catch (error) {
      setAnalyzing(false);
      console.log(error);
    }
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  // This component renders the batch processing button, select all (checkmarks)
  // and also displays the progress bar
  const batchButton = () => {
    if (loading || analyzing) {
      return null;
    } else {
      return (
        <>
          <Progress
            style={{ marginTop: '10px' }}
            strokeColor={{
              from: '#108ee9',
              to: '#87d068',
            }}
            percent={20.0}
            status="active"
          />
          <div
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button type="primary" key="batchanalyze">
              Batch Process
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Select all
            </Checkbox>
          </div>
        </>
      );
    }
  };

  if (redirect) {
    return <Redirect to="/summary" />;
  } else {
    return (
      <div>
        {batchButton()}
        <List
          style={{ marginTop: '20px' }}
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={filteredList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag color={'green'} key={'cached'}>
                  Cached
                </Tag>,
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
