import React, { useState } from 'react';
import CommitBar from '../components/commits/CommitBar';
import SelectUser from '../components/SelectUser';
import './CommitsPage.css';
import { BackTop, Affix } from 'antd';
import Header from '../components/Header';
import FooterBar from '../components/FooterBar';
import Drawer from 'rc-drawer';

const CommitPage = () => {
  const [top, setTop] = useState();
  return (
    <>
      <Header />
      <div>
        <CommitBar />
      </div>
      <FooterBar />
    </>
  );
};

export default CommitPage;
