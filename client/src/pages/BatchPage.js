import React from 'react';
import BatchTable from '../components/batch/BatchTable';
import Header from '../components/Header';
import FooterBar from '../components/FooterBar';

const BatchPage = () => {
  return (
    <>
      <Header />
      <div style={{ marginTop: '30px', marginBottom: '30px' }}></div>
      <BatchTable />
      <FooterBar />
    </>
  );
};

export default BatchPage;
