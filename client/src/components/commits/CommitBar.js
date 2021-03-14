import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Card, Table, Space, Badge, Tag, Button } from 'antd';
import { CodeFilled, CodeOutlined } from '@ant-design/icons';
import { Drawer } from '@material-ui/core';
import { useAuth } from '../../context/AuthContext';

/**
 * Used boilerplate from https://ant.design/components/table/
 */
const CommitBar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const {
    membersList,
    usersList,
    mergeRequestList,
    setMergeRequestList,
    selectUser,
  } = useAuth();

  useEffect(() => {
    // console.log(mergeRequestList);
    // console.log(selectUser);
    // console.log(mergeRequestList[selectUser]);
  }, [selectUser]);

  /**
   * Populate Merge Requests with dummy data for testing
   */
  const mergeRequestData = [];
  const selectedUserMRList = mergeRequestList[selectUser] || 0;
  console.log(selectedUserMRList);
  if (selectedUserMRList !== 0) {
    for (let mr of selectedUserMRList) {
      const commitsData = [];
      for (let commitArray of mr['commitList']) {
        for (let commit of commitArray) {
          // console.log(commit);
          commitsData.push({
            key: commit['shortId'],
            commitid: commit['shortId'],
            date: commit['comittedDate'],
            score: commit['score'],
            message: commit['title'],
          });
        }
      }
      mergeRequestData.push({
        key: mr['id'],
        mrid: (
          <a href={mr['webUrl']} target="_blank">
            {mr['id']}
          </a>
        ),
        branch: '#57 Refactor get projects API',
        mrdiffscore: mr['score'],
        commitssum: 490,
        createdAt: mr['createdDate'],
        commitsList: commitsData,
      });
    }
  }
  console.log(mergeRequestData);

  const commitsData = [];
  /**
   * Populate Commits with dummy data for testing
   */
  for (let i = 0; i < 3; ++i) {
    commitsData.push({
      key: i,
      date: '2021-02-21 23:12:00',
      message: 'Add new routes for retrieving code & code diffs',
      commitid: 'e71b2010',
      score: '175',
    });
  }

  /**
   * Expandable Row for Commits inside a specific Merge Request
   */
  const expandedRowRender = () => {
    const columns = [
      { title: 'Commit ID', dataIndex: 'commitid', key: 'commitid' },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        filterMultiple: false,
        // TODO: Fix the sorter once API Data is available to link up
        onFilter: (value, record) => record.date.indexOf(value) === 0,
        sorter: (a, b) => a.data.length - b.date.length,
        sortDirections: ['descend', 'ascend'],
      },
      { title: 'Message', dataIndex: 'message', key: 'message' },
      { title: 'Score', dataIndex: 'score', key: 'score' },
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
              Code Diffs
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={commitsData}
        rowSelection={{ ...rowSelection, columnTitle: 'ignore' }}
        pagination={false}
      />
    );
  };

  /**
   * Column title for the Merge Requests
   */
  const columns = [
    { title: 'MR ID', dataIndex: 'mrid', key: 'mrid' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Branch', dataIndex: 'branch', key: 'branch' },
    { title: 'MR Diff', dataIndex: 'mrdiffscore', key: 'mrdiffscore' },
    { title: 'Commits Sum', dataIndex: 'commitssum', key: 'commitssum' },
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
      console.log(record, selected, selectedRows);
    },
    // Selection Logic to be implemented once API data is done
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  // Controllers for the Code Diff Drawer
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  /**
   * Render the Table component which represents the Merge Requests
   * Table represents the MR/Commits data bars
   * Drawer is an experimental feature that renders the Code Diffs for each MR and Commit
   */
  return (
    <>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        pagination={false}
        expandable={{ expandedRowRender }}
        dataSource={mergeRequestData}
        rowSelection={{ ...rowSelection, columnTitle: 'ignore' }}
      />
    </>
  );
};

export default CommitBar;
