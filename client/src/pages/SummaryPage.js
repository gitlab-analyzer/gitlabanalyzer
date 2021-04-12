import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import BarGraph from '../components/summary/BarGraph';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import StackedBarGraph from '../components/summary/StackedBar';
import Header from '../components/Header';
import FooterBar from '../components/FooterBar';

import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Comfortaa',
  },
  grid: {
    width: '100%',
    margin: '0px',
    padding: 25,
    paddingBottom: 25,
    textAlign: 'left',
  },
}));

const Summary = () => {
  const {
    selectUser,
    mergeRequestList,
    notesList,
    dataList,
  } = useAuth();

  const [combinedDropdown, setCombinedDropdown] = useState('Number');
  const [crDropdown, setCrDropdown] = useState('All');
  const [textRender, setTextRender] = useState('Number');

  const [userMRList, setUserMRList] = useState(mergeRequestList);

  const classes = useStyles();

  const COMMITS = 1;
  const MERGE_REQUESTS = 2;
  const CODE_REVIEWS = 3;
  const ISSUES = 4;

  const CODE_REVIEWS_OWN = 5;
  const CODE_REVIEWS_OTHERS = 6;

  const COMMIT_SCORE = 7;
  const MERGE_REQUEST_SCORE = 9;

  const countDates = (list, type, dates) => {
    var result = {};
    var i, j, k;
    var date;
    var rarr = [];
    
    if (type === COMMITS) {
      for(i in list) {
        if (i === selectUser) {
          for( i in list[selectUser].mr) {
            for(j in list[selectUser].mr[i].commitList) {
              if (dates.length !== 0) {
                if((dates[0]._d <= list[selectUser].mr[i].commitList[j].comittedDate) && 
                  (list[selectUser].mr[i].commitList[j].comittedDate <= dates[1]._d)){
                    date = [
                      list[selectUser].mr[i].commitList[j].comittedDate.getFullYear(),
                      list[selectUser].mr[i].commitList[j].comittedDate.getMonth() + 1,
                      list[selectUser].mr[i].commitList[j].comittedDate.getDate(),
                    ].join('-');
                    result[date] = result[date] || 0;
                    if(list[selectUser].mr[i].commitList[j].ignore == false) {
                      for(k in list[selectUser].mr[i].commitList[j].codeDiffDetail) {
                        if(list[selectUser].mr[i].commitList[j].codeDiffDetail[k].ignore == false) {
                          result[date]++;
                        }
                      }
                    }
                }
              } else {
                date = [
                  list[selectUser].mr[i].commitList[j].comittedDate.getFullYear(),
                  list[selectUser].mr[i].commitList[j].comittedDate.getMonth() +1,
                  list[selectUser].mr[i].commitList[j].comittedDate.getDate(),
                ].join('-');
                result[date] = result[date] || 0;
                if(list[selectUser].mr[i].commitList[j].ignore == false) {
                  for(k in list[selectUser].mr[i].commitList[j].codeDiffDetail) {
                    if(list[selectUser].mr[i].commitList[j].codeDiffDetail[k].ignore == false) {
                      result[date]++;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else if (type === MERGE_REQUESTS) {
      for(i in list) {
        if(i === selectUser) {
          for(i in list[selectUser].mr){
            if(dates.length !== 0) {
              if((dates[0]._d <= list[selectUser].mr[i].createdDate) && (list[selectUser].mr[i].createdDate <= dates[1]._d)){
                  date = [
                    list[selectUser].mr[i].createdDate.getFullYear(),
                    list[selectUser].mr[i].createdDate.getMonth() + 1,
                    list[selectUser].mr[i].createdDate.getDate(),
                  ].join('-');
                  result[date] = result[date] || 0;
                  if(list[selectUser].mr[i].ignore == false) {
                    result[date]++;
                  }
              }
            } else {
              date = [
                list[selectUser].mr[i].createdDate.getFullYear(),
                list[selectUser].mr[i].createdDate.getMonth() + 1,
                list[selectUser].mr[i].createdDate.getDate(),
              ].join('-');
              result[date] = result[date] || 0;
              if(list[selectUser].mr[i].ignore == false) {
                result[date]++;
              }
            }
          }
        }
      }
    } else if (type === CODE_REVIEWS) {
      for(i = 0; i < list.length; i++) {
          if ((selectUser === list[i].author) && (list[i].noteableType === "MergeRequest" || list[i].noteableType === "Commit")) {
            if (dates.length !== 0) {
              if((dates[0]._d <= list[i].createdDate) && (list[i].createdDate <= dates[1]._d)) {
                date = [list[i].createdDate.getFullYear(),
                        list[i].createdDate.getMonth() + 1,
                        list[i].createdDate.getDate(),
                      ].join('-');
                      result[date] = result[date] || 0;
                      result[date] += list[i].wordCount;
              }
            } else {
              date = [list[i].createdDate.getFullYear(),
                        list[i].createdDate.getMonth() + 1,
                        list[i].createdDate.getDate(),
                      ].join('-');
                      result[date] = result[date] || 0;
                      result[date] += list[i].wordCount;
            }
          }
        }
    } else if (type === ISSUES) {
      for(i = 0; i < list.length; i++) {
        if ((selectUser === list[i].author) && (list[i].noteableType === "Issue")) {
          if (dates.length !== 0) {
            if((dates[0]._d <= list[i].createdDate) && (list[i].createdDate <= dates[1]._d)) {
              date = [list[i].createdDate.getFullYear(),
                      list[i].createdDate.getMonth() + 1,
                      list[i].createdDate.getDate(),
                    ].join('-');
                    result[date] = result[date] || 0;
                    result[date] += list[i].wordCount;
            }
          } else {
            date = [list[i].createdDate.getFullYear(),
                      list[i].createdDate.getMonth() + 1,
                      list[i].createdDate.getDate(),
                    ].join('-');
                    result[date] = result[date] || 0;
                    result[date] += list[i].wordCount;
          }
        }
      }
    } else if (type === CODE_REVIEWS_OWN) {
      for(i = 0; i < list.length; i++) {
        if ((selectUser === list[i].author) && (list[i].ownership === "Own") && ((list[i].noteableType === "MergeRequest") || (list[i].noteableType === "Commit"))) {
          if (dates.length !== 0) {
            if((dates[0]._d <= list[i].createdDate) && (list[i].createdDate <= dates[1]._d)) {
              date = [list[i].createdDate.getFullYear(),
                      list[i].createdDate.getMonth() + 1,
                      list[i].createdDate.getDate(),
                    ].join('-');
                    result[date] = result[date] || 0;
                    result[date] += list[i].wordCount;
            }
          } else {
            date = [list[i].createdDate.getFullYear(),
                      list[i].createdDate.getMonth() + 1,
                      list[i].createdDate.getDate(),
                    ].join('-');
                    result[date] = result[date] || 0;
                    result[date] += list[i].wordCount;
          }
        }
      }
    } else if (type === CODE_REVIEWS_OTHERS) {
      for(i = 0; i < list.length; i++) {
        if ((selectUser === list[i].author) && (list[i].ownership === "Other") && ((list[i].noteableType === "MergeRequest") || (list[i].noteableType === "Commit"))) {
          if (dates.length !== 0) {
            if((dates[0]._d <= list[i].createdDate) && (list[i].createdDate <= dates[1]._d)) {
              date = [list[i].createdDate.getFullYear(),
                      list[i].createdDate.getMonth() + 1,
                      list[i].createdDate.getDate(),
                    ].join('-');
                    result[date] = result[date] || 0;
                    result[date] += list[i].wordCount;
            }
          } else {
            date = [list[i].createdDate.getFullYear(),
                      list[i].createdDate.getMonth() + 1,
                      list[i].createdDate.getDate(),
                    ].join('-');
                    result[date] = result[date] || 0;
                    result[date] += list[i].wordCount;
          }
        }
      }
    } else if (type === MERGE_REQUEST_SCORE) {
      for(i in list) {
        if(i === selectUser) {
          for(i in list[selectUser].mr){
            if(dates.length !== 0) {
              if((dates[0]._d <= list[selectUser].mr[i].createdDate) && (list[selectUser].mr[i].createdDate <= dates[1]._d)){
                  date = [
                    list[selectUser].mr[i].createdDate.getFullYear(),
                    list[selectUser].mr[i].createdDate.getMonth() + 1,
                    list[selectUser].mr[i].createdDate.getDate(),
                  ].join('-');
                  result[date] = result[date] || 0;
                  if(list[selectUser].mr[i].ignore == false) {
                    for(k in list[selectUser].mr[i].codeDiffDetail) {
                      if(list[selectUser].mr[i].codeDiffDetail[k].ignore == false) {
                        result[date] += list[selectUser].mr[i].codeDiffDetail[k].score;
                      }
                    }
                  }
              }
            } else {
              date = [
                list[selectUser].mr[i].createdDate.getFullYear(),
                list[selectUser].mr[i].createdDate.getMonth() + 1,
                list[selectUser].mr[i].createdDate.getDate(),
              ].join('-');
              result[date] = result[date] || 0;
              if(list[selectUser].mr[i].ignore == false) {
                for(k in list[selectUser].mr[i].codeDiffDetail) {
                  if(list[selectUser].mr[i].codeDiffDetail[k].ignore == false) {
                    result[date] += list[selectUser].mr[i].codeDiffDetail[k].score;
                  }
                }
              }
            }
          }
        }
      }
    } else if (type === COMMIT_SCORE) {
      for(i in list) {
        if (i === selectUser) {
          for( i in list[selectUser].mr) {
            for(j in list[selectUser].mr[i].commitList) {
              if (dates.length !== 0) {
                if((dates[0]._d <= list[selectUser].mr[i].commitList[j].comittedDate) && (list[selectUser].mr[i].commitList[j].comittedDate <= dates[1]._d)){
                  date = [
                    list[selectUser].mr[i].commitList[j].comittedDate.getFullYear(),
                    list[selectUser].mr[i].commitList[j].comittedDate.getMonth() + 1,
                    list[selectUser].mr[i].commitList[j].comittedDate.getDate(),
                  ].join('-');
                  result[date] = result[date] || 0;
                  if(list[selectUser].mr[i].commitList[j].ignore == false) {
                    for(k in list[selectUser].mr[i].commitList[j].codeDiffDetail) {
                      if(list[selectUser].mr[i].commitList[j].codeDiffDetail[k].ignore == false) {
                        result[date] += list[selectUser].mr[i].commitList[j].codeDiffDetail[k].score;
                      }
                    }
                  }
                }
              } else {
                date = [
                  list[selectUser].mr[i].commitList[j].comittedDate.getFullYear(),
                  list[selectUser].mr[i].commitList[j].comittedDate.getMonth() + 1,
                  list[selectUser].mr[i].commitList[j].comittedDate.getDate(),
                ].join('-');
                result[date] = result[date] || 0;
                if(list[selectUser].mr[i].commitList[j].ignore == false) {
                  for(k in list[selectUser].mr[i].commitList[j].codeDiffDetail) {
                    if(list[selectUser].mr[i].commitList[j].codeDiffDetail[k].ignore == false) {
                      result[date] += list[selectUser].mr[i].commitList[j].codeDiffDetail[k].score;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    for (i in result) {
      if (result.hasOwnProperty(i)) {
        rarr.push({ date: i, counts: result[i] });
      }
    }
    return rarr;
  };

  const populateDates = (array) => {
    var result = [];
    var i;
    for (i in array) {
      result.push(array[i].date);
    }
    return result.reverse();
  };

  const populateCounts = (array) => {
    var result = [];
    var i;
    for (i in array) {
      result.push(array[i].counts);
    }
    return result.reverse();
  };

  // Computations for graph data - fine to leave this here since it will be updated on selectUser
  var dailyCommitsArray = countDates(userMRList, COMMITS, dataList)
  var commitDatesArray = populateDates(dailyCommitsArray)
  var commitCountsArray = populateCounts(dailyCommitsArray)

  // Merge Request logic not complete - commits as placeholder
  var dailyMRsArray = countDates(userMRList, MERGE_REQUESTS, dataList)
  // MR date array is shared with commit dates
  var mrCountsArray = populateCounts(dailyMRsArray)

  var dailyCRArray = countDates(notesList, CODE_REVIEWS, dataList)
  var CRDatesArray = populateDates(dailyCRArray)
  var CRCountsArray = populateCounts(dailyCRArray)

  var dailyIssuesArray = countDates(notesList, ISSUES, dataList)
  var issueDatesArray = populateDates(dailyIssuesArray)
  var issueCountsArray = populateCounts(dailyIssuesArray)

  var dailyCROwn = countDates(notesList, CODE_REVIEWS_OWN, dataList)
  var CROwnDatesArray = populateDates(dailyCROwn)
  var CROwnCountsArray = populateCounts(dailyCROwn)

  var dailyCROtherArray = countDates(notesList, CODE_REVIEWS_OTHERS, dataList)
  var CROtherDatesArray = populateDates(dailyCROtherArray)
  var CROtherCountsArray = populateCounts(dailyCROtherArray)

  var dailyMRScores = countDates(userMRList, MERGE_REQUEST_SCORE, dataList)
  var dailyMRScoresArray = populateCounts(dailyMRScores)

  var dailyCommitScores = countDates(userMRList, COMMIT_SCORE, dataList)
  var dailyCommitScoresArray = populateCounts(dailyCommitScores)

  // will need dates based on snapshot taken from context
  const [dateArray, setDateArray] = useState(commitDatesArray);
  const [crDateArray, setCrDateArray] = useState(CRDatesArray);
  const [issueDateArray, setIssueDateArray] = useState(issueDatesArray);

  useEffect(() => {
    if(combinedDropdown === 'Number') {
    setCombinedSeries([
      {
        name: 'Merge Requests',
        data: mrCountsArray,
      },
      {
        name: 'Commits',
        data: commitCountsArray,
      },
    ])
    } else {
      setCombinedSeries([
        {
          name: 'Merge Requests',
          data: dailyMRScoresArray,
        },
        {
          name: 'Commits',
          data: dailyCommitScoresArray,
        },
      ])
    }
    setCrSeries([
      {
        name: 'CR Words',
        data: CRCountsArray,
      }
    ])
    setIssueSeries([
      {
      name: 'Issue Words',
      data: issueCountsArray,
      }
    ])
    setDateArray(commitDatesArray)

    if(crDropdown === 'All') {
      setCrDateArray(CRDatesArray)
    } else if (crDropdown === 'Own') {
      setCrDateArray(CROwnDatesArray)
    } else if (crDropdown === 'Other'){
      setCrDateArray(CROtherDatesArray)
    }

    setIssueDateArray(issueDatesArray)
  }, [selectUser, dataList])

  const [combinedSeries, setCombinedSeries] = useState([
    {
      name: 'Merge Requests',
      data: [],
    },
    {
      name: 'Commits',
      data: [],
    },
  ]);

  const [crSeries, setCrSeries] = useState([
    {
      name: 'Code Review Words',
      data: [],
    },
  ]);

  const [issueSeries, setIssueSeries] = useState([
    {
      name: 'Issue Words',
      data: [],
    },
  ]);

  const handleMenuClick = (e) => {
    if (e.key === 'Num') {
      setCombinedDropdown('Number');
      setCombinedSeries([
        {
          data: mrCountsArray,
        },
        {
          data: commitCountsArray,
        },
      ]);
      setTextRender('Number');
    } else if (e.key === 'Score') {
      setCombinedDropdown('Score');
      setCombinedSeries([
        {
          data: dailyMRScoresArray,
        },
        {
          data: dailyCommitScoresArray,
        },
      ]);
      setTextRender('Score');
    } else if (e.key === 'crAll') {
      setCrDropdown('All');
      setCrSeries([
        {
          data: CRCountsArray,
        },
      ]);
      setCrDateArray(CRDatesArray)
    } else if (e.key === 'crOwn') {
      setCrDropdown('Own');
      setCrSeries([
        {
          data: CROwnCountsArray,
        },
      ]);
      setCrDateArray(CROwnDatesArray)
    } else if (e.key === 'crOthers') {
      setCrDropdown('Others');
      setCrSeries([
        {
          data: CROtherCountsArray,
        },
      ]);
      setCrDateArray(CROtherDatesArray)
    }
  };

  const combinedMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Num">Number</Menu.Item>
      <Menu.Item key="Score">Score</Menu.Item>
    </Menu>
  );

  const crMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="crAll">All</Menu.Item>
      <Menu.Item key="crOwn">Own</Menu.Item>
      <Menu.Item key="crOthers">Others</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Header />
      <Grid container className={classes.grid}>
        <Grid item xs={12}>
          <b>
            Merge Request & Commit {textRender}
          </b>
        </Grid>
        <Grid item xs={10}>
          <StackedBarGraph 
            series={combinedSeries} 
            xlabel={commitDatesArray}
          />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <Dropdown overlay={combinedMenu}>
            <Button>
              {combinedDropdown} <DownOutlined />
            </Button>
          </Dropdown>
        </Grid>
        <Grid item xs={12}>
          <b>
            Code Review Word Count ({crDropdown})
          </b>
        </Grid>
        <Grid item xs={10}>
          <BarGraph 
            series={crSeries} 
            colors={'#f8f0d4'} 
            stroke={'#CBB97B'} 
            xlabel={crDateArray} 
            id={2}
          />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <Dropdown 
          overlay={crMenu}
          >
            <Button>
              {crDropdown} <DownOutlined />
            </Button>
          </Dropdown>
        </Grid>
        <Grid item xs={12}>
          <b>
            Issue Word Count
          </b>
        </Grid>
        <Grid item xs={10}>
          <BarGraph
            series={issueSeries}
            colors={'#d4d8f8'}
            stroke={'#7F87CF'}
            xlabel={issueDatesArray}
            id={3}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <FooterBar />
    </div>
  );
};

export default Summary;
