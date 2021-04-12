import React, { useEffect } from 'react';
import HorizontalScroll from './Scroll';
import { useAuth } from '../../context/AuthContext';
import './EveryoneScore.css';

const usercolours = [
  '#b0911d',
  '#1d2cb0',
  '#1db084',
  '#0091e3',
  '#489850',
  '#bb4824',
  '#a34d9a',
  '#ab3ca6',
];
export var barData = [];

const EveryoneScore = () => {
  const { 
    notesList, 
    mergeRequestList, 
    setFloatScores, 
    dataList, 
    selectUser, 
    anon,
    commitsMaster,
  } = useAuth();

  
  const dateOutOfRange = (value) => {  
    return value < dataList[0] || value > dataList[1];
  };

  useEffect(() => {

    async function updateData() {
      barData = [];
      let subscore = {};
      let num = 0;
      let cmMaster = {};

      if (commitsMaster) {
        for (let [cmUser, cmObj] of Object.entries(commitsMaster['commit_list'])) {
          cmMaster[cmUser] = {count:0, score:0, type:{}, print:true}
          cmMaster[cmUser]['print'] = false;
          for (let [cmID, cmValue] of Object.entries(cmObj)) {
            cmMaster[cmUser]['count']++;
            for (let [cmKey, cmPropValue] of Object.entries(cmValue['code_diff_detail'])) {
              if (cmPropValue['ignore']){
                continue;
              }
              cmMaster[cmUser]['score'] += cmPropValue['score'];
              if (cmPropValue['file_type'] in cmMaster[cmUser]['type']) {
                cmMaster[cmUser]['type'][cmPropValue['file_type']] += cmPropValue['score'];
              }
              else {
                cmMaster[cmUser]['type'][cmPropValue['file_type']] = cmPropValue['score'];
              }
            }
          }
        }
      }
      if (notesList) {
        for (let [noteKey, noteObj] of Object.entries(notesList)) {
          if (noteObj['ignore'] || dataList[0]==null ||
            (dateOutOfRange(noteObj['createdDate'])))
          {
            continue;
          }
          if (noteObj['author'] in subscore) {
            subscore[noteObj['author']] += noteObj['score'];
          } else {
            subscore[noteObj['author']] = noteObj['score'];
          }
        }
      }
      if (mergeRequestList !== 0) {
        for (let [user, uservalue] of Object.entries(mergeRequestList)) {
          let fileType = {};
          let mrScore = 0;
          let mrCount = 0;
          let cmScore = 0;
          let cmCount = 0;
          for (let [mrID, mrObj] of Object.entries(uservalue['mr'])) {
            if (mrObj['ignore'] || dateOutOfRange(mrObj['mergedDate'])) {
              continue;
            }
            if (!mrObj['codeDiffDetail']['ignore']) {
              mrCount++;
            }
            for (let [codeDiffFile, codeDiffFileObj] of Object.entries(mrObj['codeDiffDetail'])) {
              if (!codeDiffFileObj['ignore']) {
                
                mrScore += codeDiffFileObj['score'];
                if (codeDiffFileObj['file_type'] in fileType) {
                  fileType[codeDiffFileObj['file_type']] += codeDiffFileObj['score'];
                }
                else {
                  fileType[codeDiffFileObj['file_type']] = codeDiffFileObj['score'];
                }
              }
            }
            for (let [commitID, commitObj] of Object.entries(mrObj['commitList'])) {
              if (commitObj['ignore'] || dateOutOfRange(commitObj['comittedDate'])) {
                continue;
              }
              else {
                cmCount++;
                for (let [commitFileID, commitFileObject] of Object.entries(commitObj['codeDiffDetail'])) {
                  if (!commitFileObject['ignore']) {
                    cmScore += commitFileObject['score'];
                  }
                }
              }
            }
          }
          if (!subscore[user]) {
            subscore[user] = 0;
          }
          for (let file in fileType){
            if (cmMaster[toString(user)]) {
              for (let [cmfiletype, cmfileScore] of Object.entries(cmMaster[toString(user)]['type'])) {
                if (file === cmfiletype) {
                  fileType[file] += cmfileScore;
                }
                else {
                  fileType[cmfiletype] = cmfileScore;
                }
              }
            }
          }
          barData.push({
            name: user,
            id: num++,
            weightscore: mrScore + (cmMaster[user] ? cmMaster[user]['score'] : 0),
            mrscore: mrScore,
            mrcount: mrCount,
            cmscore: cmScore + (cmMaster[user] ? cmMaster[user]['score'] : 0),
            cmcount: cmCount + (cmMaster[user] ? cmMaster[user]['count'] : 0),
            issue: subscore[user],
            filetype: fileType
          });
        }
      }
      await setFloatScores([...barData]);  
    }
    updateData();
  }, [mergeRequestList, dataList, selectUser]);

  useEffect(() => {}, [barData]);
  const scrollRef = HorizontalScroll();
  return (
    <div className="floatbarContainer">
      <div className="floatbarLabels">
        <div className="scoreLabel">weighted score</div>
        <div className="remainingLabels">
          <div>commits</div>
          <div>merge request</div>
          <div>issues & reviews</div>
        </div>
      </div>
      <div className="scoreContainer" ref={scrollRef}>
        <div className="fbMapContainer">
          {barData.map((Detail, index) => {
            return (
              <div className="scoreArray">
                <div style={{ color: usercolours[Detail.id] }}>
                  {
                    (anon && "User"+(Detail.id)) || 
                    (
                      (Detail.name)
                    )
                  }
                </div>
                <div className="userScore">
                  {Detail.weightscore.toFixed(0)}
                </div>
                <div className="userScoreDetails">
                  <div>{Detail.cmcount}</div>
                  <div>{Detail.mrcount}</div>
                  <div>{Detail.issue}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default EveryoneScore;
