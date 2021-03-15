import React from 'react';
import 'antd/dist/antd.css';
import { Table, Badge, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const BatchTable = () => {
  const expandedRowRender = () => {
    const columns = [
      { title: 'Username', dataIndex: 'username', key: 'username', width: 425 },
      { title: 'Date Analyzed', dataIndex: 'date', key: 'date', width: 250 },
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
      { title: 'Score', dataIndex: 'wscore', key: 'wscore' },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => <Button icon={<DownloadOutlined />}>Download</Button>,
        width: 150,
      },
    ];

    // Hardcoded data generation
    // To be removed in the branch after this merge
    const data = [];
    for (let i = 0; i < 8; ++i) {
      data.push({
        username: 'jwayne',
        key: i,
        date: '2021-02-24 23:12:00',
        wscore: '3847',
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const columns = [
    { title: 'Group Name', dataIndex: 'groupname', key: 'groupname' },
    { title: 'Repo Title', dataIndex: 'repo', key: 'repo' },
    { title: 'Date Analyzed', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <span>
          <Badge status="success" />
          Finished
        </span>
      ),
    },
    { title: 'Marked by', dataIndex: 'markedby', key: 'markedby' },
    {
      title: 'Report',
      key: 'operation',
      render: () => (
        <Button type="primary" icon={<DownloadOutlined />}>
          Download
        </Button>
      ),
      width: 150,
    },
  ];

  // Hardcoded data generation
  // To be removed in the branch after this merge
  const data = [];
  for (let i = 0; i < 5; ++i) {
    data.push({
      key: i,
      groupname: 'Polaris',
      repo: 'GitLab Analyzer',
      status: '10.3.4.5654',
      markedby: 'bfraser',
      createdAt: '2021-02-24 23:12:00',
    });
  }

  for (let i = 6; i < 11; ++i) {
    data.push({
      key: i,
      groupname: 'Sirius',
      repo: 'GitLab Analyzer',
      status: '10.3.4.5654',
      markedby: 'bfraser',
      createdAt: '2021-02-29 23:12:00',
    });
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandable={{ expandedRowRender }}
      dataSource={data}
    />
  );
};

export default BatchTable;
