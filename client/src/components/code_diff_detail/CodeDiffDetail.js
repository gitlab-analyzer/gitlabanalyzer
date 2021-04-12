import React from 'react';
import { Popover, Button } from 'antd';
import './CodeDiffDetail.css';
import CodeDiffTextFields from './CodeDiffTextFields';

const CodeDiffDetail = (scoreDetail, multiplier, finalScore) => {
  return (
    <div>
      <Popover
        content={CodeDiffTextFields(scoreDetail, multiplier, finalScore)}
        title={'Score Breakdown'}
        trigger={'click'}
      >
        <Button type={'primary'} name={Button} className={Button}>
          Score Detail
        </Button>
      </Popover>
    </div>
  );
};

export default CodeDiffDetail;
