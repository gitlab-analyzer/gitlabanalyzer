import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Checkbox, List, Avatar, Button } from 'antd';
import { fetchData } from './commitData';
import { useAuth } from '../../context/AuthContext';

// Used boilerplate from https://ant.design/components/list/
const CommitBar = ({ username }) => {
  const [commits, setCommits] = useState([]);
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

  return (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 8,
      }}
      dataSource={getDataSource()}
      renderItem={(commits) => (
        <List.Item
          actions={[
            <Button size="small" type="primary">
              commits
            </Button>,
            <Button ghost size="small" type="primary">
              details 2
            </Button>,
            <Checkbox>ignore</Checkbox>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar shape="square" size="large" src={commits.avatar} />}
            title={<a href="/commits">{commits.title}</a>}
            description={`${commits.username} Updated: ${commits.date}`}
          />
          <div>{commits.weighting}%</div>
        </List.Item>
      )}
    />
  );
};

export default CommitBar;
