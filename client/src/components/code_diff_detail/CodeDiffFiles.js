import React from 'react';

import { Table } from 'antd';

const CodeDiffFiles = () => {
  const dataSource = [
    // {
    //   key: '1',
    //   name: 'Mike',
    //   age: 32,
    //   address: '10 Downing Street',
    // },
    // {
    //   key: '2',
    //   name: 'John',
    //   age: 42,
    //   address: '10 Downing Street',
    // },
    {
      key: '1',
      name: 'server/app.py',
      lc: 10,
      multiplier: 'Yes',
      score: 10 * 12,
    },
    {
      key: '2',
      name: 'client/src/components/login/LogOut.js',
      lc: 5,
      multiplier: 'No',
      score: 5 * 7,
    },
    {
      key: '3',
      name: 'client/src/pages/Overview.js',
      lc: 5,
      multiplier: 'No',
      score: 5 * 32,
    },
    {
      key: '4',
      name: 'client/src/components/SearchPage.js',
      lc: 5,
      multiplier: 'No',
      score: 5 * 25,
    },
    {
      key: '5',
      name: 'client/src/pages/Overview.js',
      lc: 5,
      multiplier: 'No',
      score: 5 * 20,
    },
    {
      key: '6',
      name: 'client/src/ServiceWorker.js',
      lc: 5,
      multiplier: 'No',
      score: 5 * 10,
    },
  ];

  const columns = [
    {
      title: 'File name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'New File',
      dataIndex: 'multiplier',
      key: 'multiplier',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
  ];

  return (
    <Table
      size="small"
      style={{ width: '610px' }}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
  );
};

export default CodeDiffFiles;
