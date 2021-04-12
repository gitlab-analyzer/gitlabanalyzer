import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Collapse, Divider } from 'antd';
import './DisplayScore.css';

const { Panel } = Collapse;

const DisplayScore = () => {
  const {
    mergeRequestList,
    selectUser,
    currentConfig,
  } = useAuth();
  let mrScore = 0;
  let commitScore = 0;
  let fileScore = [];

  let TotalScoreData = [];

  const CalculateScore = () => {
    for (let [user, uservalue] of Object.entries(mergeRequestList)) {
      let totalMR = 0;
      let totalCommit = 0;
      let fileType = {};
      for (let [mrID, mrvalue] of Object.entries(uservalue['mr'])) {
        totalMR += mrvalue['score'];
        for (let [commitID, commitvalue] of Object.entries(
          mrvalue['commitList']
        )) {
          totalCommit += commitvalue['score'];
          for (let [codediffFile, filevalue] of Object.entries(
            commitvalue['codeDiffDetail']
          )) {
            if (filevalue['file_type'] in fileType) {
              fileType[filevalue['file_type']] += filevalue['score'];
            } else {
              fileType[filevalue['file_type']] = filevalue['score'];
            }
          }
        }
      }
      TotalScoreData.push({
        [user]: {
          mr: totalMR.toFixed(1),
          commit: totalCommit.toFixed(1),
          fileType,
        },
      });
    }

    for (let [key, data] of Object.entries(TotalScoreData)) {
      if (selectUser in data) {
        mrScore = data[selectUser]['mr'];
        commitScore = data[selectUser]['commit'];
        fileScore = data[selectUser]['fileType'];
      }
    }
  }
  CalculateScore();
  useEffect(() => {
    CalculateScore();
  }, [])

  return (
    <div>
      {console.log('commit score in return', commitScore)}
      <Collapse style={{ margin: '10px 0px 20px 0px' }}>
        <Panel key="1" header="Total Scores">
          <div style={{ height: 15 }} />
          <div className="TotalScoreContainer">
            <div className="scoreType">Student's Commits :</div>
            <div className="scoreNumber">{commitScore}</div>
          </div>
          <Divider />
          <div className="TotalScoreContainer">
            <div className="scoreType">Merge Request :</div>
            <div className="scoreNumber">{mrScore}</div>
          </div>
          <Divider />
          <div className="FileTypeScoreContainer">
            <div className="fileType">Each File Type :</div>
            <div className="fileContainer">
              {Object.keys(fileScore).map(function (item) {
                return (
                  <div className="filesInner">
                    <div className="fileName">
                      {item}
                    </div>
                    <div className="fileScore">
                      {fileScore[item].toFixed(1)}
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
