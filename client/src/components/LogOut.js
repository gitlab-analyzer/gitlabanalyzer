import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const LogOut = () => {
  const { setUser, setRepo } = useAuth();

  const handleLogOut = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('user');
    setRepo(null);
    setUser(null);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={handleLogOut}
        icon={<LogoutOutlined />}
        className="logout"
        size="large"
      >
        Log Out
      </Button>
    </div>
  );
};

export default LogOut;
