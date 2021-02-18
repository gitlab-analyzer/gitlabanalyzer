import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
// import './index.css';
import { Popover, Checkbox, List, Avatar, Button, Skeleton } from 'antd';
import { fetchData, fetchNames } from './commitData';

// Used boilerplate from https://ant.design/components/list/

import reqwest from 'reqwest';

const count = 5;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

const CommitBar = ({ username }) => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [commits, setCommits] = useState([]);
  const [hover, setHover] = useState({ visible: false });

  useEffect(() => {
    getData((res) => {
      setInitLoading(false);
      setData(res.results);
      setList(res.results);
    });
    getFakeData();
  }, []);

  const getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  };

  const getFakeData = async () => {
    const data = await fetchData();
    setCommits(data);
  };

  const onLoadMore = () => {
    setLoading(true);
    const tosetList = data.concat(
      [...new Array(5)].map(() => ({ loading: true, name: {} }))
    );
    setList(tosetList);

    getData((res) => {
      setData(data.concat(res.results));
      setData(data);
      setList(data);
      setLoading(false);
      window.dispatchEvent(new Event('resize'));
    });
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>Load More</Button>
      </div>
    ) : null;

  const hide = () => {
    setHover({ visible: false });
  };

  const handleVisibleChange = (visible) => {
    setHover({ visible });
  };

  return (
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={commits}
      renderItem={(commits) => (
        <List.Item
          actions={[
            <Button size="small" type="primary">
              code
            </Button>,
            <Popover
              content={<a onClick={hide}>Close</a>}
              title="Title"
              trigger="click"
              visible={hover.visible}
              onVisibleChange={handleVisibleChange}
            >
              <Button ghost size="small" type="primary">
                details
              </Button>
            </Popover>,
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
