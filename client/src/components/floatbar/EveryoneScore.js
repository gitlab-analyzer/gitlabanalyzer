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

export function ScoreCalculator(username) {
  let TotalScore;
  for (let i = 0; i < barData.length; i++) {
    let data = barData[i];
    if (username === data['name']) {
      TotalScore =
        parseInt(data['commits']) +
        parseInt(data['code']) +
        parseInt(data['issue']) +
        parseInt(data['deleted']) * 0.2 +
        parseInt(data['syntax']) * 0.2;
    }
  }
  return TotalScore;
}

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

  console.log('master', commitsMaster);
  
  const dateOutOfRange = (value) => {  
    if (value < dataList[0] || value > dataList[1]) {
      return true;
    }
    return false;
  };

  useEffect(() => {

    async function updateData() {
      barData = [];
      let subscore = {};
      let num = 0;

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
          barData.push({
            name: user,
            id: num++,
            weightscore: mrScore,
            // weightscore: mrScore+masterCm,
            mrscore: mrScore,
            mrcount: mrCount,
            cmscore: cmScore,
            cmcount: cmCount,
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
