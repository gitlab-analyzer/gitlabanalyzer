import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
// import './index.css';
import { List, Avatar, Button, Skeleton } from 'antd';

import { fetchData, fetchNames } from './commitData';

import reqwest from 'reqwest';

const count = 5;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

const CommitBar = ({ username }) => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [commits, setCommits] = useState([]);

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
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

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
            <a href="/commits" key="list-loadmore-edit">
              code
            </a>,
            <a href="/commits" key="list-loadmore-more">
              expand
            </a>,
            <a href="/commits" key="list-loadmore-ignore">
              ignore
            </a>,
          ]}
        >
          {/* <Skeleton avatar title={false} loading={item.loading} active> */}
          <List.Item.Meta
            avatar={<Avatar shape="square" size="large" src={commits.avatar} />}
            title={<a href="/commits">{commits.title}</a>}
            description={`${commits.username} Updated: ${commits.date}`}
          />
          <div>content</div>
          {/* </Skeleton> */}
        </List.Item>
      )}
    />
  );
};

export default CommitBar;
