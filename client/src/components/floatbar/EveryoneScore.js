import React, { useEffect } from 'react';
import HorizontalScroll from './Scroll';
import { useAuth } from '../../context/AuthContext';
import './EveryoneScore.css';
import axios from "axios";

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
  const { notesList, mergeRequestList, setFloatScores, dataList, selectUser, anon } = useAuth();

  console.log('MR',mergeRequestList);
  
    const dateInRange = (value) => {
      // new Date(value)
      console.log('date type', value); 
      console.log(dataList);
    }

  useEffect(() => {

    async function updateData() {
      barData = [];
      let subscore = {};
      let ignore = false;
      let num = 0;
      /////////////////////////
      let mrIgnore, mrFileIgnore;
      ////////////////////////

      if (notesList) {
        for (let [noteKey, noteObj] of Object.entries(notesList)) {
          if (noteObj['ignore'] ||
            (dataList[0]==null || ((noteObj['createdDate'] < new Date(dataList[0]))) ||
            (noteObj['createdDate'] > new Date(dataList[1])))) 
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
      console.log('mergerequestlist', mergeRequestList);
      if (mergeRequestList !== 0) {
        for (let [user, uservalue] of Object.entries(mergeRequestList)) {
          let fileType = {};
          let commitScore = 0;
          let linesAdded = 0;
          let linesDeleted = 0;
          let syntaxChanged = 0;
          let mrScore = 0;
          let mrCount = 0;
          let cmScore = 0;
          let cmCount = 0;
          for (let [mrID, mrObj] of Object.entries(uservalue['mr'])) {
            if (mrObj['ignore']) {
              mrIgnore = true;
              continue;
            }
            if (dateInRange(mrObj['createdDate'])) {

            }
            //TODO: Iterate Code Diffs in this Level
            // console.log(mrID, mrObj)
            // console.log('code diff detail', mrObj['codeDiffDetail'])
            for (let [codeDiffFile, codeDiffFileObj] of Object.entries(mrObj['codeDiffDetail'])) {
              console.log(codeDiffFile, codeDiffFileObj)
              if (!codeDiffFileObj['ignore']) {
                // mrFileIgnore = true;
                // continue;
                // console.log(codeDiffFileObj['file_type'])
                mrCount++;
                mrScore += codeDiffFileObj['score'];
                if (codeDiffFileObj['file_type'] in fileType) {
                  fileType[codeDiffFileObj['file_type']] += codeDiffFileObj['score'];
                }
                else {
                  fileType[codeDiffFileObj['file_type']] = codeDiffFileObj['score'];
                }
                // console.log(codeDiffFileObj['file_type'])
              }
            }
            // console.log(mrID, mrObj);
            for (let [commitID, commitObj] of Object.entries(mrObj['commitList'])) {
              // console.log(commitID, commitObj)]
              if (commitObj['ignore']) {
                continue;
              }
              else {
              // if (!commitObj['ignore']) {  // ignore commit
                for (let [commitFileID, commitFileObject] of Object.entries(commitObj['codeDiffDetail'])) {
                  console.log(commitFileID, commitFileObject)
                  if (!commitFileObject['ignore']) {
                    cmCount++;
                    cmScore += commitFileObject['score'];
                  }
                }
              }
            }
            // console.log('value', value)
            // if (value['ignore']) {
            //   continue;
            // }
            // console.log(value["ignore"])
            for (let [k, v] of Object.entries(mrObj['commitList'])) {
              if (v['ignore']) {
                ignore = true
                continue;
              }
              if (
                (v['comittedDate'] < new Date(dataList[0])) || 
                (v['comittedDate'] > new Date(dataList[1]))
              ) {
                ignore = true
                continue;
              }
              commitScore += v['score'];
            }
            for (let [keylines, valuelines] of Object.entries(
              mrObj['lineCounts']
            )) {
              if (!ignore) {
                linesAdded += mrObj['lineCounts']['lines_added'];
                linesDeleted += mrObj['lineCounts']['lines_deleted'];
                syntaxChanged += mrObj['lineCounts']['syntax_changes'];
              }
            }
            ignore = false
          }
          if (!subscore[user]) {
            subscore[user] = 0;
          }
          barData.push({
            name: user,
            id: num++,
            commits: commitScore.toFixed(0),
            code: linesAdded,
            deleted: linesDeleted,
            syntax: syntaxChanged,
            issue: subscore[user],
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
          <div>lines of code</div>
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
                  {ScoreCalculator(Detail.name).toFixed(0)}
                </div>
                <div className="userScoreDetails">
                  <div>{Detail.commits}</div>
                  <div>{Detail.code}</div>
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
