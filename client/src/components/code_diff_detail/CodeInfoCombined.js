import React from 'react';
import CodeDiffTable from './CodeDiffTable';
import CodeDiffFiles from './CodeDiffFiles';

const CodeInfoCombined = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <CodeDiffTable />
      <CodeDiffFiles />
    </div>
  );
};

export default CodeInfoCombined;
