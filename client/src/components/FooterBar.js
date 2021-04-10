import React from 'react';

import { Layout } from 'antd';

const { Footer } = Layout;

const FooterBar = () => {
  return (
    <Footer
      style={{
        marginTop: '50px',
        marginBottom: '0px',
        textAlign: 'right',
        backgroundColor: '#ecf2f5',
      }}
    >
      Made by: 🪐 Makemake
    </Footer>
  );
};

export default FooterBar;
