import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Popover, Checkbox, List, Avatar, Button, Skeleton } from 'antd';
import { fetchData } from './commitData';
import { useAuth } from '../../context/AuthContext';

// Used boilerplate from https://ant.design/components/list/
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

  const hide = () => {
    setHover({ visible: false });
  };

  const handleVisibleChange = (visible) => {
    setHover({ visible });
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
      // loading={initLoading}
      itemLayout="horizontal"
      // loadMore={loadMore}
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
            // <Popover
            //   content={<a onClick={hide}>Close</a>}
            //   title="Title"
            //   trigger="click"
            //   visible={hover.visible}
            //   onVisibleChange={handleVisibleChange}
            // >
            <Button ghost size="small" type="primary">
              details
            </Button>,
            // </Popover>,
            <Checkbox>ignore</Checkbox>,
          ]}
        >
          {/* <Skeleton avatar title={false} loading={item.loading} active> */}
          <List.Item.Meta
            avatar={<Avatar shape="square" size="large" src={commits.avatar} />}
            title={<a href="/commits">{commits.title}</a>}
            description={`${commits.username} Updated: ${commits.date}`}
          />
          <div>{commits.weighting}%</div>
          {/* </Skeleton> */}
        </List.Item>
      )}
    />
  );
};

export default CommitBar;
