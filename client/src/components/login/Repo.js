import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import {
  Popconfirm,
  Tag,
  Button,
  Checkbox,
  List,
  Avatar,
  Progress,
  Drawer,
  notification,
  Form,
  Popover,
} from 'antd';
import { useAuth } from '../../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import { SavedConfigs } from '../../pages/ConfigPage';
import {
  CloseCircleOutlined,
  ConsoleSqlOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import InitialConfig from '../../pages/InitialConfig';
import axios from 'axios';

/// TODO: Hardcoded because of some weird bug
let selectRepo = 2;
const Repo = ({ analyzing, setAnalyzing, loading, insideApp }) => {
  const {
    setMembersList,
    setUsersList,
    setCommitsList,
    setNotesList,
    setMergeRequestList,
    setCommentsList,
    setSelectMembersList,
    setSelectUser,
    selectedRepo,
    setSelectedRepo,
    batchList,
    setBatchList,
    reList,
    setReList,
    filteredList,
    setFilteredList,
    setRepo,
    value,
    setValue,
    currentConfig,
    setCurrentConfig,
    setDataList,
    setFinishedConfig,
    commitsMaster,
    setCommitsMaster,
    finishedConfig,
  } = useAuth();

  const [redirect, setRedirect] = useState(false);
  const [visible, setVisible] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [syncPercent, setSyncPercent] = useState(0);
  const [selectVal, setSelectVal] = useState(false);
  const [analyzeConfirm, setAnalyzeConfirm] = useState(false);
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {}, [
    filteredList,
    batchList,
    reList,
    selectVal,
    selectedRepo,
  ]);

  const handleSubmit = async (value) => {
    setVisible(false);
    setCurrentConfig(value);
    setDataList(value.date);
    setFinishedConfig(true);

    let configDict = {};
    configDict['name'] = 'default';
    configDict['value'] = value;
    let currConfig = JSON.stringify(configDict);
    const configStatus = await axios.post(
      `http://localhost:5678/config`,
      currConfig,
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
    fetchErrorChecker(configStatus.data['response'], 'config');
  };

  // General error handling function for fetch requests
  const fetchErrorChecker = (res, dataType) => {
    if (!res) {
      console.log(`Failed to retrieve ${dataType} list!`);
      throw new Error('Fetch request failed.');
    }
  };

  // Set project ID to the users chosen ID
  const syncProjectId = async () => {
    axios.defaults.withCredentials = true;
    const projectRes = await axios.post(
      `http://localhost:5678/projects/${selectRepo}/sync`,
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
    if (!projectRes.data['response']) {
      console.log('Failed to set project ID!');
      throw new Error('Fetch request failed.');
    }
  };

  /**
   * Fetch sync status with an interval of 5,000 milliseconds until it is 100% synced.
   * Upon syncing, it will update syncDone state to reveal redirect button.
   */
  const syncProject = async () => {
    const syncStatus = await axios.post(
      `http://localhost:5678/projects/${selectRepo}/sync/state`,
      {
        withCredentials: true,
      }
    );
    fetchErrorChecker(syncStatus.data['response'], 'sync');
    const numberStat = syncStatus.data['status'].syncing_progress;
    setSyncPercent(parseInt(numberStat));
    if (syncStatus.data['status'].is_syncing) {
      setTimeout(async function repeat() {
        syncProject();
      }, 5000);
      return;
    } else {
      setSyncDone(true);
      updateRepos();
      setAnalyzing(false);
      return;
    }
  };

  // Function for fetching members list data
  const fetchMembers = async () => {
    const membersRes = await axios.get(
      `http://localhost:5678/projects/${selectRepo}/members`,
      {
        withCredentials: true,
      }
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
    const usersRes = await axios.get(
      `http://localhost:5678/projects/${selectRepo}/users`,
      {
        withCredentials: true,
      }
    );

    fetchErrorChecker(usersRes.data['response'], 'users');
    setUsersList([...usersRes.data['users']]);
  };
  // Function for fetching commits list data
  const fetchCommits = async () => {
    const commitsRes = await axios.get(
      `http://localhost:5678/projects/${selectRepo}/commit/user/all`,
      {
        withCredentials: true,
      }
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

  const multiplier = [0, 0, 0, 0, 1, 0.2, 0, 0.2];
  const fields = [
    'lines_added',
    'lines_deleted',
    'comments_added',
    'comments_deleted',
    'blanks_added',
    'blanks_deleted',
    'spacing_changes',
    'syntax_changes',
  ];

  // Function for fetching commits list data
  const fetchCommitsMaster = async () => {
    const commitsMasterRes = await axios.get(
      `http://localhost:5678/projects/${selectRepo}/commit/master/direct/user/all`,
      {
        withCredentials: true,
      }
    );
    fetchErrorChecker(commitsMasterRes.data['response'], 'commits master');

    const tempCommits = {
      commit_list: { ...commitsMasterRes.data['commit_list'] },
    };

    for (let [k, v] of Object.entries(tempCommits['commit_list'])) {
      for (let [k1, v1] of Object.entries(v)) {
        for (let [k2, v2] of Object.entries(v1['code_diff_detail'])) {
          v2['score'] = mrScore(v2, true);
          v2['ignore'] = false;
          // tempCommits['commit_list'][k1]['code_diff_detail']['score'] = mrScore(v2, true);
        }
      }
    }

    setCommitsMaster({ ...tempCommits });
  };

  const mrScore = (codediffdetail, singleFile) => {
    let index;
    let totalScore = 0;
    // maybe move file type
    let totalFileType = {};

    if (singleFile) {
      let lines = codediffdetail['line_counts'];
      let ext = codediffdetail['file_type'];
      index = 0;

      for (let type in lines) {
        totalScore += lines[type] * multiplier[index];
        index++;
      }

      if (ext in lang) {
        totalScore *= lang[ext];
      }
      return totalScore;
    } else {
      for (let file of codediffdetail) {
        let score = 0;
        let lines = file['line_counts'];
        let ext = file['file_type'];
        index = 0;
        for (let type in lines) {
          score += lines[type] * multiplier[index];
          index++;
        }
        if (ext in lang) {
          score *= lang[ext];
        }
        if (ext in totalFileType) {
          totalFileType[ext] += score;
        } else {
          totalFileType[ext] = score;
        }
        totalScore += score;
      }
      return totalScore;
    }
  };

  let lang = {};

  // Function for fetching, parsing, and storing merge requests list data
  const fetchMergeRequests = async () => {
    const mergeRequestRes = await axios.get(
      `http://localhost:5678/projects/${selectRepo}/merge_request/user/all`,
      {
        withCredentials: true,
      }
    );

    fetchErrorChecker(mergeRequestRes.data['response'], 'merge request');

    // Generate a temporary merge request list to parse and set to Global Context API
    const generateTempMR = () => {
      const mrList = mergeRequestRes.data['merge_request_users_list'];
      if (currentConfig.language) {
        for (let [langkey, langvalue] of Object.entries(
          currentConfig.language
        )) {
          lang[langvalue.extname] = langvalue.extpoint;
        }
      }

      const tempMR = {};
      // Loop through object key
      for (let [user, mz] of Object.entries(mrList)) {
        tempMR[user] = {
          mr: {},
          weightedScore: 0,
        };
        // Loop through object item
        for (let author of mrList[user]) {
          let tempCommits = {};
          for (let commit of author.commit_list) {
            tempCommits[commit.short_id] = {
              authorName: commit.author_name,
              codeDiffId: commit.code_diff_id,
              comittedDate: new Date(commit.committed_date),
              codeDiffDetail: { ...commit.code_diff_detail },
              committerName: commit.committer_name,
              id: commit.id,
              relatedMr: author.id,
              lineCounts: commit.line_counts,
              shortId: commit.short_id,
              title: commit.title,
              webUrl: commit.web_url,
              // Frontend defined variables Start --------------------------
              // Initial score calculation
              score: mrScore(commit.code_diff_detail, false),
              // Flag to ignore this commit
              ignore: false,
              omitScore: 0,
              // Frontend defined variables End --------------------------
            };
            // Calculates and embeds a score for each file within a commit
            for (let [k1, v1] of Object.entries(
              tempCommits[commit.short_id]['codeDiffDetail']
            )) {
              let path = `cm.${user}.${author['id']}.${commit.short_id}.${k1}`;
              tempCommits[commit.short_id]['codeDiffDetail'][k1][
                'score'
              ] = mrScore(v1, true);
              tempCommits[commit.short_id]['codeDiffDetail'][k1][
                'ignore'
              ] = false;
              tempCommits[commit.short_id]['codeDiffDetail'][k1]['path'] = path;
            }
          }
          tempMR[user].mr[author.id] = {
            author: author.author,
            codeDiffId: author.code_diff_id,
            comments: author.comments,
            codeDiffDetail: { ...author.code_diff_detail },
            commitList: tempCommits,
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
            // score:
            //   author.line_counts.lines_added +
            //   author.line_counts.lines_deleted * 0.1,
            score: mrScore(author.code_diff_detail, false),
            // Flag to ignore this MR
            ignore: false,
            omitScore: 0,
            // Frontend defined variables End --------------------------
          };

          // Experimental
          for (let [k1, v1] of Object.entries(
            tempMR[user].mr[author.id]['codeDiffDetail']
          )) {
            let npath = `mr.${user}.${author['id']}.${k1}`;
            tempMR[user].mr[author.id]['codeDiffDetail'][k1]['score'] = mrScore(
              v1,
              true
            );
            tempMR[user].mr[author.id]['codeDiffDetail'][k1]['ignore'] = false;
            tempMR[user].mr[author.id]['codeDiffDetail'][k1]['path'] = npath;
          }
        }
      }
      return tempMR;
    };
    setMergeRequestList(generateTempMR());
  };

  // Function for fetching, parsing, and storing notes list data
  const fetchNotes = async () => {
    const notesRes = await axios.get(
      `http://localhost:5678/projects/${selectRepo}/comments/all`,
      {
        withCredentials: true,
      }
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
      owner_of_noteable: note.owner_of_noteable,
      ownership: note.ownership,
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
      `http://localhost:5678/projects/${selectRepo}/comments/user/all`,
      {
        withCredentials: true,
      }
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
            owner_of_noteable: comment.owner_of_noteable,
            ownership: comment.ownership,
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
      return tempComments;
    };
    setCommentsList(generateTempComments());
  };

  /**
   * Function that handles setting project ID and fetching all necessary data
   * for analysis
   * Parses all fetched data and store them in global context state
   */
  const handleAnalyze = async (e, id) => {
    try {
      setAnalyzing(true);
      // Set project ID in context api
      setSelectedRepo(id);
      selectRepo = id;
      // This sets the project ID to be analyzed and initiates syncing process
      await syncProjectId();
      // This is a recursive call that checks the status of syncing process every 5000 milliseconds
      await syncProject();
    } catch (error) {
      setAnalyzing(false);
      console.log(error);
    }
  };

  const includedInBatchList = (project) => {
    for (let included in batchList) {
      if (project.id === included.id) {
        return true;
      }
    }
    return false;
  };

  const updateRepos = async () => {
    const repoList = await axios.get('http://localhost:5678/projects', {
      withCredentials: true,
    });
    setRepo(repoList.data.projects);

    const projectsData = repoList.data.projects;

    const projectsList = projectsData.map((project) => {
      return {
        id: project.id,
        name: project.name,
        lastSynced: dateToAgoConverter(project.last_synced),
        batched: includedInBatchList(project),
      };
    });
    setReList([...projectsList]);

    if (value === '') {
      setFilteredList(reList);
    } else {
      setFilteredList(
        reList.filter((repo) =>
          repo['name'].toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const syncBatch = async () => {
    let payload = {};
    let batchArray = [];

    for (let [k, v] of Object.entries(filteredList)) {
      batchArray.push(v.id);
    }
    payload['project_list'] = batchArray;

    let final = JSON.stringify(payload);

    const batchStatus = await axios.post(
      `http://localhost:5678/projects/sync/batch/state`,
      final,
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
    fetchErrorChecker(batchStatus.data['response'], 'batch');
    const numberStat = batchStatus.data['totalProgress'];
    setSyncPercent(parseInt(numberStat));
    if (batchStatus.data['totalProgress'] !== '100') {
      setTimeout(async function repeat() {
        syncBatch();
      }, 5000);
      return;
    } else {
      setSyncDone(true);
      updateRepos();
      setAnalyzing(false);
      return;
    }
  };

  const syncBatchers = async () => {
    let batchArray = [];

    for (let item in batchList) {
      batchArray.push(item.id);
    }

    // To Fix, batchArray should be used here instead
    let payload = JSON.stringify({
      project_list: [2, 3],
    });

    axios.defaults.withCredentials = true;
    const batchRes = await axios.post(
      `http://localhost:5678/projects/sync/batch`,
      payload,
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
    if (!batchRes.data['response']) {
      console.log('Failed to set project ID!');
      throw new Error('Fetch request failed.');
    }
  };

  const letsBatchEm = async () => {
    try {
      setAnalyzing(true);
      await syncBatchers();
      await syncBatch();
    } catch (error) {
      setAnalyzing(false);
      console.log(error);
    }
  };

  const batchProcessButton = () => {
    const content = (
      <div>
        <p style={{ fontFamily: 'Arial' }}>
          Please Checkmark the repos you would like to Batch Process
        </p>
      </div>
    );
    if (batchList.length > 0) {
      return (
        <Button onClick={letsBatchEm} type="primary" key="batchanalyze">
          Batch Process
        </Button>
      );
    } else {
      return (
        <Popover content={content} title="Batch List Missing">
          <Button disabled type="primary" key="batchanalyze">
            Batch Process
          </Button>
        </Popover>
      );
    }
  };

  // This component renders the batch processing button, select all (checkmarks)
  // and also displays the progress bar
  const batchButton = () => {
    return (
      <>
        <Progress
          style={{ marginTop: '10px' }}
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
          percent={syncPercent}
          status="active"
        />
        <div
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {insideApp ? null : (
            <Popover content="Global Configuration">
              <SettingOutlined
                height="100px"
                style={{
                  marginRight: 10,
                  fontSize: 20,
                  color: '#1890ff',
                }}
                onClick={handleDrawer}
              />
            </Popover>
          )}
          <Button
            onClick={selectAll}
            style={{ marginRight: '10px' }}
            type="primary"
            ghost
          >
            {selectVal ? 'Deselect all' : 'Select All'}
          </Button>
          {batchProcessButton()}
        </div>
      </>
    );
  };

  /**
   * Function that is responsible to fetching all data from backend,
   * Parsing and storing in global context for frontend services to use
   * This function is lightweight, as most of the time consuming work has been done
   * in the backend during handelAnazlye() call.
   */
  const fetchAndRedirect = async () => {
    try {
      // Fetches Member list
      await fetchMembers();
      await fetchUsers();
      await fetchCommits();
      await fetchMergeRequests();
      await fetchCommitsMaster();
      await fetchNotes();
      await fetchComments();
      setRedirect(true);
    } catch (error) {
      setAnalyzing(false);
      console.log(error);
    }
  };

  const checkBatchList = (item) => {
    let isInArray = batchList.find((el) => {
      return el.id === item.id;
    });
    return isInArray;
  };

  const updateFilteredList = (item) => {
    setFilteredList(
      filteredList.map((project) => {
        if (project.id !== item.id) {
          return project;
        } else {
          return { ...project, batched: !project.batched };
        }
      })
    );

    setReList(
      reList.map((project) => {
        if (project.id !== item.id) {
          return project;
        } else {
          return { ...project, batched: !project.batched };
        }
      })
    );
  };

  const addtoBatchList = (item) => {
    // Check if included in batchlist, if so, remove
    if (checkBatchList(item)) {
      // Remove
      let newList = batchList.filter((batch) => batch.id !== item.id);
      setBatchList([...newList]);
      updateFilteredList(item);
    } else {
      // If not, add to batchlist
      updateFilteredList(item);
      setBatchList([...batchList, item]);
    }
  };

  const tagRender = (item) => {
    if (analyzing && selectedRepo === item.id) {
      return (
        <Tag
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          icon={<SyncOutlined spin />}
          color="processing"
          key={'cached'}
        >
          Analyzing
        </Tag>
      );
    } else if (item['lastSynced'] === null) {
      return (
        <Tag color={'red'} key={'cached'}>
          Not Cached
        </Tag>
      );
    } else {
      return (
        <Tag
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          color={'green'}
          key={'cached'}
        >
          Cached: {Math.round(item['lastSynced'])} min ago
        </Tag>
      );
    }
  };

  const renderProject = (id) => {
    setSelectedRepo(id);
    selectRepo = id;
    fetchAndRedirect();
  };

  const innerContent = () => <p>Global Configuration Incomplete</p>;

  const goRender = (item) => {
    if (item['lastSynced'] === null) {
      return (
        <Button type="primary" disabled>
          Go
        </Button>
      );
    } else if (!finishedConfig) {
      return (
        <Popover content={innerContent}>
          <Button type="primary" disabled>
            Go
          </Button>
        </Popover>
      );
    } else {
      return (
        <Button
          onClick={() => {
            renderProject(item.id);
          }}
          type="primary"
        >
          Go
        </Button>
      );
    }
  };

  const popMsg = () => {
    return (
      <>
        <div>This Repository has already been synced before,</div>
        <div>Are you sure you want to re-sync it again?</div>
      </>
    );
  };

  const renderAnalyze = (item) => {
    if (item['lastSynced'] === null) {
      return (
        <Button
          onClick={(e) => {
            handleAnalyze(e, item.id);
          }}
          key="analyze"
        >
          Analyze
        </Button>
      );
    } else {
      return (
        <Popconfirm
          title={popMsg}
          onConfirm={(e) => {
            handleAnalyze(e, item.id);
          }}
        >
          <Button ghost type="primary" key="analyze">
            Analyze
          </Button>
        </Popconfirm>
      );
    }
  };

  const selectAll = () => {
    if (!selectVal) {
      setSelectVal(true);
      let newFilter = filteredList.map((project) => {
        if (project.batched) {
          return project;
        } else {
          return {
            ...project,
            batched: true,
          };
        }
      });
      setFilteredList(newFilter);
      setBatchList(newFilter);
    } else {
      setSelectVal(false);
      setFilteredList(
        filteredList.map((project) => {
          if (!project.batched) {
            return project;
          } else {
            return {
              ...project,
              batched: false,
            };
          }
        })
      );
      setBatchList([]);
    }
  };

  const dateToAgoConverter = (date) => {
    if (date === null) {
      return null;
    }
    const dateBefore = new Date(date + '-0700');
    const dateAfter = new Date();

    return (dateAfter - dateBefore) / (1000 * 60);
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
                tagRender(item),
                renderAnalyze(item),
                goRender(item),
                <Checkbox
                  checked={item.batched}
                  onClick={() => {
                    addtoBatchList(item);
                  }}
                >
                  Batch
                </Checkbox>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    src="https://cdn4.iconfinder.com/data/icons/logos-and-brands-1/512/144_Gitlab_logo_logos-512.png"
                  />
                }
                title={item.name}
              />
            </List.Item>
          )}
        />
        <Drawer
          placement="right"
          width="600px"
          closable={false}
          onClose={onClose}
          visible={visible}
          title="GLOBAL CONFIGURATION"
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button style={{ marginRight: 10 }} onClick={onClose}>
                Close
              </Button>
              <Button type="primary" onClick={form.submit}>
                Save
              </Button>
            </div>
          }
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <InitialConfig />
          </Form>
        </Drawer>
      </div>
    );
  }
};

export default Repo;
