import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Collapse, Divider } from 'antd';
import { barData } from '../floatbar/EveryoneScore';
import './DisplayScore.css';

const { Panel } = Collapse;

const DisplayScore = () => {
  const {
    selectUser,
  } = useAuth();

  let userData = barData.find((x) => x.name === selectUser);

  return (
    <div>
      <Collapse style={{ margin: '10px 0px 20px 0px' }}>
        <Panel key="1" header="Total Scores">
          <div style={{ height: 15 }} />
          <div className="TotalScoreContainer">
            <div className="scoreType">Student's Commits :</div>
            <div className="scoreNumber">{( userData && userData['cmscore'].toFixed(1)) || 0}</div>
          </div>
          <Divider />
          <div className="TotalScoreContainer">
            <div className="scoreType">Merge Request :</div>
            <div className="scoreNumber">{( userData && userData['mrscore'].toFixed(1)) || 0}</div>
          </div>
          <Divider />
          <div className="FileTypeScoreContainer">
            <div className="fileType">Each File Type :</div>
            <div className="fileContainer">
              {userData && Object.keys(userData['filetype']).map(function (item) {
                return (
                  <div className="filesInner">
                    <div className="fileName">
                      {item}
                    </div>
                    <div className="fileScore">
                      {userData['filetype'][item].toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};
export default DisplayScore;
