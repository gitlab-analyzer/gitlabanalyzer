import React, { useState, useEffect } from 'react';
import { fetchNames } from '../components/commits/commitData';
import CommitBar from '../components/commits/CommitBar';
import CommitGraph from '../components/commits/CommitGraph';
import { Menu, Dropdown, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import './CommitsPage.css';

const CommitPage = () => {
  const [userNames, setUserNames] = useState([]);
  const { selectUser, setSelectUser } = useAuth();

  useEffect(() => {
    const loadFakeData = async () => {
      const load = await fetchNames();
      setUserNames(['everyone', ...load]);
    };
    loadFakeData();
  }, []);

  const handleMenuClick = (e) => {
    message.info(`Switched to @${e.key}`);
    setSelectUser('@' + e.key);
  };

  const userItems = userNames.map((user) => {
    return (
      <Menu.Item key={user} icon={<UserOutlined />}>
        @{user}
      </Menu.Item>
    );
  });

  const menu = <Menu onClick={handleMenuClick}>{userItems}</Menu>;

  return (
    <div className="open-sans">
      <div style={{ margin: '10px 0 10px 0' }}>
        <Dropdown.Button
          overlay={menu}
          placement="bottomCenter"
          icon={<UserOutlined />}
        >
          {selectUser}
        </Dropdown.Button>
      </div>
      <CommitBar username={userNames[0]} />
    </div>
  );
};

export default CommitPage;
