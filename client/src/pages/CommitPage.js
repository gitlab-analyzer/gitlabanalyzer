import React, { useState, useEffect } from 'react';
import { fetchNames } from '../components/commits/commitData';
import CommitBar from '../components/commits/CommitBar';
import CommitGraph from '../components/commits/CommitGraph';
import { Menu, Dropdown, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './CommitsPage.css';

const CommitPage = () => {
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    const loadFakeData = async () => {
      const load = await fetchNames();
      setUserNames([...load]);
    };
    loadFakeData();
  }, []);

  const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        @jwayne
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        @schan
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        @aroberts
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="open-sans">
      <CommitGraph />
      <div style={{ margin: '10px 0 10px 0' }}>
        <Dropdown.Button
          overlay={menu}
          placement="bottomCenter"
          icon={<UserOutlined />}
        >
          @everyone
        </Dropdown.Button>
      </div>
      <CommitBar username={userNames[0]} />
    </div>
  );
};

export default CommitPage;
