import React, { useEffect } from 'react';
import HorizontalScroll from './Scroll';
import { useAuth } from '../../context/AuthContext';
import { configSettings } from '../login/Repo'
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
  const { notesList, mergeRequestList, setFloatScores } = useAuth();

  useEffect(() => {
    barData = [];
    var subscore = {};
    let ignore = false;
    if (notesList !== 0) {
      console.log(notesList)
      for (let [nkey, nvalue] of Object.entries(notesList)) {
        console.log('created date', nvalue['createdDate'])
        console.log('new date', new Date(configSettings.startdate))
        if (nvalue['ignore'] || 
          ((nvalue['createdDate'] < new Date(configSettings.startdate)) || 
          (nvalue['createdDate'] > new Date(configSettings.enddate)))) 
        {
          continue;
        }
        if (nvalue['author'] in subscore) {
          subscore[nvalue['author']] += nvalue['score'];
        } else {
          subscore[nvalue['author']] = nvalue['score'];
        }
      }
    }
    if (mergeRequestList !== 0) {
      for (let [user, uservalue] of Object.entries(mergeRequestList)) {
        let commitScore = 0;
        let linesAdded = 0;
        let linesDeleted = 0;
        let syntaxChanged = 0;
        for (let [key, value] of Object.entries(uservalue['mr'])) {
          if (value['ignore']) {
            continue;
          }
          for (let [k, v] of Object.entries(value['commitList'])) {
            if (v['ignore']) {
              ignore = true
              continue;
            }
            // console.log(v['authorName'],v['comittedDate'])
            if (
              (v['comittedDate'] < new Date(configSettings.startdate)) || 
              (v['comittedDate'] > new Date(configSettings.enddate))
            ) {
              // console.log('out of bounds')
              ignore = true
              continue;
            }
            commitScore += v['score'];
          }
          for (let [keylines, valuelines] of Object.entries(
            value['lineCounts']
          )) {
            if (!ignore) {
              linesAdded += value['lineCounts']['lines_added'];
              linesDeleted += value['lineCounts']['lines_deleted'];
              syntaxChanged += value['lineCounts']['syntax_changes'];
            }
          }
          ignore = false
        }
        if (!subscore[user]) {
          subscore[user] = 0;
        }
        barData.push({
          name: user,
          commits: commitScore.toFixed(0),
          code: linesAdded,
          deleted: linesDeleted,
          syntax: syntaxChanged,
          issue: subscore[user],
        });
      }
    }
    setFloatScores([...barData]);
  }, [mergeRequestList]);

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
                <div className="user" style={{ color: usercolours[index] }}>
                  @{Detail.name}
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
