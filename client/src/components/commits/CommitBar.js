import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Card, Table, Space, Badge, Tag, Button } from 'antd';
import { CodeFilled, CodeOutlined } from '@ant-design/icons';
// import { Drawer } from '@material-ui/core';
import { useAuth } from '../../context/AuthContext';

/**
 * Used boilerplate from https://ant.design/components/table/
 */
const CommitBar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showCommits, setShowCommits] = useState(false);
  const {
    membersList,
    usersList,
    mergeRequestList,
    setMergeRequestList,
    selectUser,
  } = useAuth();

  useEffect(() => {}, [selectUser]);
  const dateFormatter = (dateObject) => {
    let today = new Date();
    let ampm = '';
    let thisYear = today.getFullYear();
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let month = dateObject.getMonth();
    let day = dateObject.getDate();
    let year = dateObject.getFullYear();
    let hour = dateObject.getHours();
    let minute = dateObject.getMinutes();

    if (hour === 0) {
      hour = 12;
      ampm = 'am';
    } else if (hour >= 13) {
      hour -= 12;
      ampm = 'pm';
    } else {
      ampm = 'am';
    }

    if (thisYear === year) {
      return `${months[month]} ${day} @ ${hour}:${minute}${ampm}`;
    } else {
      return `${months[month]} ${year} ${day} @ ${hour}:${minute}${ampm}`;
    }
  };

  /**
   * Populate Merge Requests with real data
   */
  console.log('original', mergeRequestList);
  let mergeRequestData = [];
  let commitsOnlyData = [];
  const selectedUserMRList = mergeRequestList[selectUser] || 0;
  if (selectedUserMRList !== 0) {
    for (let mr of selectedUserMRList['mr']) {
      const commitsData = [];
      for (let commitArray of mr['commitList']) {
        for (let commit of commitArray) {
          // console.log(commit);
          commitsData.push({
            key: commit['shortId'],
            // commitid: commit['shortId'],
            commitid: (
              <a href={commit['webUrl']} target="_blank">
                {commit['shortId']}
              </a>
            ),
            relatedMr: commit['relatedMr'],
            date: dateFormatter(commit['comittedDate']),
            score: commit['score'],
            message: commit['title'],
          });
        }
        // This constructs a separate list for commits only
        commitsOnlyData = [...commitsOnlyData, ...commitsData];
      }
      mergeRequestData.push({
        key: mr['id'],
        mrid: (
          <a href={mr['webUrl']} target="_blank">
            {mr['id']}
          </a>
        ),
        branch: mr['title'],
        mrdiffscore: mr['score'],
        commitssum: 490,
        createdAt: dateFormatter(mr['createdDate']),
        commitsList: commitsData,
      });
    }
    console.log(commitsOnlyData);
  }

  const columnsCommits = [
    {
      title: 'Commit ID',
      dataIndex: 'commitid',
      key: 'commitid',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 160,
      filterMultiple: false,
      // TODO: Fix the sorter once API Data is available to link up
      onFilter: (value, record) => record.date.indexOf(value) === 0,
      sorter: (a, b) => a.data.length - b.date.length,
      sortDirections: ['descend', 'ascend'],
    },
    { title: 'Message', dataIndex: 'message', key: 'message', width: 405 },
    { title: 'Score', dataIndex: 'score', key: 'score', width: 135 },
    {
      title: 'Status',
      key: 'state',
      render: () => (
        <span>
          <Badge status="success" color={'blue'} />
          <Tag color="blue">Included</Tag>
        </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: () => (
        <Space size="middle">
          <Button icon={<CodeOutlined />} onClick={showDrawer}>
            Diffs
          </Button>
        </Space>
      ),
    },
  ];

  /**
   * Expandable Row for Commits inside a specific Merge Request
   */
  const expandedRowRender = (commitsList) => {
    return (
      <Table
        columns={columnsCommits}
        dataSource={commitsList}
        rowSelection={{ ...commitSelection, columnTitle: 'ignore' }}
        pagination={false}
      />
    );
  };

  /**
   * Column title for the Merge Requests
   */
  const columns = [
    { title: 'MR ID', dataIndex: 'mrid', key: 'mrid', width: 150 },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    { title: 'Title', dataIndex: 'branch', key: 'branch', width: 320 },
    {
      title: 'MR Diff',
      dataIndex: 'mrdiffscore',
      key: 'mrdiffscore',
      width: 85,
    },
    {
      title: 'Commits Sum',
      dataIndex: 'commitssum',
      key: 'commitssum',
      width: 135,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',

      render: () => (
        <span>
          <Badge status="success" />
          <Tag color="green">Merged</Tag>
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'operation',
      render: () => (
        <Button type="primary" onClick={showDrawer} icon={<CodeFilled />}>
          Expand
        </Button>
      ),
    },
  ];

  const ignoreCommit = (commitId, relatedMr) => {
    // console.log('Ignored', commitId, relatedMr);
    // console.log('test', mergeRequestList[selectUser]);
    const newMergeRequestState = {
      ...mergeRequestList,
      [selectUser]: {
        mr: [...mergeRequestList[selectUser]['mr']],
        weightedScore: mergeRequestList[selectUser]['weightedScore'],
      },
    };
    console.log(newMergeRequestState);
  };

  const unIgnoreCommit = (commitId) => {
    console.log('Unignored', commitId);
  };

  // This object defines the behavior of ignore selectors
  const commitSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows
      // );
    },
    // Selection Logic to be implemented once API data is done
    onSelect: (record, selected, selectedRows) => {
      console.log(record);
      ignoreCommit(record['key'], record['relatedMr']);
    },
    onSelectInvert: (record, selected, selectedRows) => {
      unIgnoreCommit(record['key']);
    },
    // Selection Logic to be implemented once API data is done
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
    },
  };

  // This object defines the behavior of ignore selectors
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    // Selection Logic to be implemented once API data is done
    onSelect: (record, selected, selectedRows) => {
      // console.log(record, selected, selectedRows);
    },
    // Selection Logic to be implemented once API data is done
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
    },
  };

  // Controllers for the Code Diff Drawer
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  // Event handler for merge/commit Buttons
  const onMergeHandler = (e) => {
    e.preventDefault();
    setShowCommits(false);
  };

  const onCommitHandler = (e) => {
    e.preventDefault();
    setShowCommits(true);
  };

  const mergeCommitButtonBar = () => {
    return (
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={onMergeHandler} type={showCommits ? '' : 'primary'}>
          Merge Requests
        </Button>
        <Button
          onClick={onCommitHandler}
          type={showCommits ? 'primary' : ''}
          style={{ marginLeft: '10px' }}
        >
          Commits
        </Button>
      </div>
    );
  };

  /**
   * Render the Table component which represents the Merge Requests
   * Table represents the MR/Commits data bars
   * Drawer is an experimental feature that renders the Code Diffs for each MR and Commit
   */
  return (
    <>
      {mergeCommitButtonBar()}
      {showCommits ? (
        <Table
          className="components-table-demo-nested"
          columns={columnsCommits}
          dataSource={commitsOnlyData}
          rowSelection={{ ...commitSelection, columnTitle: 'ignore' }}
          pagination={false}
        />
      ) : (
        <Table
          className="components-table-demo-nested"
          columns={columns}
          pagination={false}
          expandedRowRender={(record) => expandedRowRender(record.commitsList)}
          dataSource={mergeRequestData}
          rowSelection={{ ...rowSelection, columnTitle: 'ignore' }}
        />
      )}
    </>
  );
};

export default CommitBar;
