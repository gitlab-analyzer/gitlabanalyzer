import React from 'react';
import BatchTable from '../components/batch/BatchTable';

const BatchPage = () => {
  return (
    <div>
      <div style={{ height: '200px' }}>
        <h2>Batch Processing</h2>
      </div>
      <BatchTable />
    </div>
  );
};

export default BatchPage;
