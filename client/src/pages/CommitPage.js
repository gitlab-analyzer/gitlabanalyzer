import React, { useState, useEffect } from 'react';
import { fetchNames } from '../components/commits/commitData';
import CommitBar from '../components/commits/CommitBar';
import { Menu, Dropdown, message, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import './CommitsPage.css';
import CommitsHeatBar from '../components/commits/CommitsHeatBar';
import { data } from '../components/commits/HeatData';

import Drawer from 'rc-drawer';

const CommitPage = () => {
  const [userNames, setUserNames] = useState([]);
  const { selectUser, setSelectUser } = useAuth();
  const [open, setOpen] = useState(false);

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

  const SubMenu = Menu.SubMenu;
  const MenuItemGroup = Menu.ItemGroup;

  const onClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <div style={{ margin: '10px 0 10px 0' }}>
        <Dropdown.Button
          overlay={menu}
          placement="right"
          icon={<UserOutlined />}
        >
          {selectUser}
        </Dropdown.Button>
      </div>
      <div style={{ height: '200px' }}>
        <CommitsHeatBar data={data} />
      </div>
      <CommitBar username={userNames[0]} />
    </div>
    // <div>
    //   <Drawer
    //     placement="right"
    //     width="200px"
    //     handler={false}
    //     open={open}
    //     onClose={onClick}
    //   >
    //     <Menu
    //       style={{ height: '200%' }}
    //       defaultSelectedKeys={['1']}
    //       defaultOpenKeys={['sub1']}
    //       mode="inline"
    //     >
    //       <SubMenu
    //         key="sub1"
    //         title={
    //           <span>
    //             <span>Navigation One</span>
    //           </span>
    //         }
    //       >
    //         <MenuItemGroup key="g1" title="Item 1">
    //           <Menu.Item key="1">Option 1</Menu.Item>
    //           <Menu.Item key="2">Option 2</Menu.Item>
    //         </MenuItemGroup>
    //         <MenuItemGroup key="g2" title="Item 2">
    //           <Menu.Item key="3">Option 3</Menu.Item>
    //           <Menu.Item key="4">Option 4</Menu.Item>
    //         </MenuItemGroup>
    //       </SubMenu>
    //       <SubMenu
    //         key="sub2"
    //         title={
    //           <span>
    //             <span>Navigation Two</span>
    //           </span>
    //         }
    //       >
    //         <Menu.Item key="5">Option 5</Menu.Item>
    //         <Menu.Item key="6">Option 6</Menu.Item>
    //         <SubMenu key="sub3" title="Submenu">
    //           <Menu.Item key="7">Option 7</Menu.Item>
    //           <Menu.Item key="8">Option 8</Menu.Item>
    //         </SubMenu>
    //       </SubMenu>
    //       <SubMenu
    //         key="sub4"
    //         title={
    //           <span>
    //             <span>Navigation Three</span>
    //           </span>
    //         }
    //       >
    //         <Menu.Item key="9">Option 9</Menu.Item>
    //         <Menu.Item key="10">Option 10</Menu.Item>
    //         <Menu.Item key="11">Option 11</Menu.Item>
    //         <Menu.Item key="12">Option 12</Menu.Item>
    //       </SubMenu>
    //     </Menu>
    //   </Drawer>
    //   <div
    //     style={{
    //       width: '100%',
    //       height: 667,
    //       background: '#fff000',
    //       color: '#fff',
    //       textAlign: 'center',
    //       lineHeight: '667px',
    //     }}
    //   >
    //     <Button onClick={onClick}>开关</Button>
    //   </div>
  );
};

export default CommitPage;
