import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Space, Badge, Tag, Button } from 'antd';
import { CodeFilled, CodeOutlined } from '@ant-design/icons';
import { fetchData } from './commitData';
import { useAuth } from '../../context/AuthContext';
import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Used boilerplate from https://ant.design/components/table/
 */
const CommitBar = () => {
  const [commits, setCommits] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { selectUser } = useAuth();

  useEffect(() => {
    getFakeData();
  }, []);

  const getFakeData = async () => {
    const data = await fetchData();
    setCommits(data);
  };

  const filterCommits = (username, commits) => {
    const filteredCommits = commits.filter((commit) => {
      return commit.username === username;
    });
    return filteredCommits;
  };

  const getDataSource = () => {
    if (selectUser === '@everyone') {
      return commits;
    } else {
      return filterCommits(selectUser, commits);
    }
  };

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
        // TODO: Fix the sorter
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

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '2021-02-21 23:12:00',
        message: 'Add new routes for retrieving code & code diffs',
        commitid: 'e71b2010',
        score: '175',
      });
    }
    return (
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{ ...rowSelection, columnTitle: 'ignore' }}
        pagination={false}
      />
    );
  };

  /**
   * Column title for the Merge Requests
   */
  const columns = [
    { title: 'Branch', dataIndex: 'branch', key: 'branch' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Score', dataIndex: 'score', key: 'score' },
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

  /**
   * Populate Merge Requests with dummy data for testing
   */
  const data = [];
  for (let i = 0; i < 20; ++i) {
    data.push({
      key: i,
      username: 'bfraser',
      branch: '#57 Refactor get projects API',
      score: 515,
      creator: 'Jack',
      createdAt: '2021-02-24 23:12:00',
    });
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const drawerHeight = 240;

  const useStyles = makeStyles((theme) => ({
    drawer: {
      height: drawerHeight,
      flexShrink: 0,
    },
  }));

  const classes = useStyles;

  /**
   * Render the Table component which represents the Merge Requests
   */
  return (
    <>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        pagination={false}
        expandable={{ expandedRowRender }}
        dataSource={data}
        rowSelection={{ ...rowSelection, columnTitle: 'ignore' }}
      />
      {/* <Drawer
        title="Basic Drawer"
        placement={'bottom'}
        closable={true}
        mask={false}
        height={'800px'}
        onClose={onClose}
        visible={drawerVisible}
        key={'bottom'}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer> */}
      <Drawer
        variant={'persistent'}
        styles={{ height: '90%' }}
        anchor={'bottom'}
        open={drawerVisible}
        onClose={onClose}
      >
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
        <h1>Hello</h1>
      </Drawer>
    </>
  );
};

export default CommitBar;
