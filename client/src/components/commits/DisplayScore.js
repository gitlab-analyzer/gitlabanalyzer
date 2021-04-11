import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Collapse, Divider } from 'antd';
import './DisplayScore.css';

const { Panel } = Collapse;

const DisplayScore = () => {
  const {
    membersList,
    mergeRequestList,
    setMergeRequestList,
    selectUser,
  } = useAuth();

  let TotalScoreData = [];
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
            // fileType[filevalue['file_type']] += 1; /////////////////       filevalue['score'] /////////////////
            fileType[filevalue['file_type']] += filevalue['score'];
          } else {
            // fileType[filevalue['file_type']] = 1; /////////////////       filevalue['score'] /////////////////
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
  let mrScore = 0;
  let commitScore = 0;
  let fileScore = [];
  for (let [key, data] of Object.entries(TotalScoreData)) {
    if (selectUser in data) {
      mrScore = data[selectUser]['mr'];
      commitScore = data[selectUser]['commit'];
      fileScore = data[selectUser]['fileType'];
    }
  }
  return (
    <div>
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
          <div className="TotalScoreContainer">
            {/* <div style={{ display: 'flex' }}> */}
            <div className="scoreType">Each File Type :</div>
            <div className="fileContainer">
              {Object.keys(fileScore).map(function (item) {
                {
                  /*{Object.keys(fileScore).forEach(item => {*/
                }
                return (
                  <div className="filesInner">
                    <div>{item}</div>
                    <div>{fileScore[item]}</div>
                  </div>
                );
              })}
              {/* </div> */}
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};
export default DisplayScore;
