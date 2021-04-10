import React from 'react';
import CodeDiffTable from './CodeDiffTable';

const CodeInfoCombined = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <CodeDiffTable />
      <CodeDiffTable
        singleFile={true}
        style={{ marginRight: '50px', marginLeft: 'auto' }}
      />
    </div>
  );
};

export default CodeInfoCombined;
