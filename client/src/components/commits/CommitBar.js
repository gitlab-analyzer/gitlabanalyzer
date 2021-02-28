import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Space, Badge, Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { fetchData } from './commitData';
import { useAuth } from '../../context/AuthContext';

/**
 * Used boilerplate from https://ant.design/components/table/
 */
const CommitBar = ({ username }) => {
  const [commits, setCommits] = useState([]);
  const [hover, setHover] = useState({ visible: false });
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

  const menu = (
    <Menu>
      <Menu.Item>Action 1</Menu.Item>
      <Menu.Item>Action 2</Menu.Item>
    </Menu>
  );

  /**
   * Expandable Row for Commits inside a specific Merge Request
   */
  const expandedRowRender = () => {
    const columns = [
      { title: 'Commits', dataIndex: 'commits', key: 'commits' },
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Status',
        key: 'state',
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        ),
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size="middle">
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '2021-02-21 23:12:00',
        name: 'This is production name',
        commits: 'e71b2010',
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  /**
   * Column title for the Merge Requests
   */
  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Score', dataIndex: 'Score', key: 'Score' },
    { title: 'Creator', dataIndex: 'creator', key: 'creator' },
    { title: 'Action', key: 'operation', render: () => <a>Publish</a> },
  ];

  /**
   * Populate Merge Requests with dummy data for testing
   */
  const data = [];
  for (let i = 0; i < 20; ++i) {
    data.push({
      key: i,
      username: 'bfraser',
      title: '#57 Refactor get projects API',
      Score: 515,
      creator: 'Jack',
      createdAt: '2021-02-24 23:12:00',
    });
  }

  /**
   * Render the Table component which represents the Merge Requests
   */
  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      pagination={false}
      expandable={{ expandedRowRender }}
      dataSource={data}
    />
  );
};

export default CommitBar;
