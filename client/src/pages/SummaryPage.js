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
    commitsList,
    mergeRequestList,
    notesList,
    dataList,
  } = useAuth();
  const [startDate, setStartDate] = useState('March 1, 2021');
  const [endDate, setEndDate] = useState('March 12, 2021');

  const [combinedDropdown, setCombinedDropdown] = useState('Number');
  const [crDropdown, setCrDropdown] = useState('All');
  const [textRender, setTextRender] = useState('Number');

  const [userCommitsList, setUserCommitsList] = useState(commitsList);
  const [userMRList, setUserMRList] = useState(mergeRequestList)

  const classes = useStyles();

  const COMMITS = 1;
  const MERGE_REQUESTS = 2;
  const CODE_REVIEWS = 3;
  const ISSUES = 4;

  // Filters all lists containing commits, MRs, code reviews, and issues
  console.log(commitsList)
  const filterLists = (list, dates, type) => {
    var result = []
    // Will give an error if unchecked
    if(dataList.length !== 0) {

      if(type == COMMITS) {
        if (dates[0]._d < dates[1]._d) {
          console.log('true')
        }
      } else if (type == MERGE_REQUESTS) {

      } else if (type == CODE_REVIEWS) {

      } else if (type == ISSUES) {

      }
    }
    return result;
  }

  var filteredCommits = filterLists(userCommitsList, dataList, COMMITS)
  console.log(filteredCommits)

  const countDates = (list, type) => {
    var result = {};
    var i, j;
    var date;
    var rarr = [];
    
    if (type == COMMITS) {
    for (i = 0; i < list.length; i++) {
      if (selectUser === list[i].userName) {
        for (j = 0; j < list[i].commits[0].length; j++) {
          date = [
            list[i].commits[0][j].commitedDate.getFullYear(),
            list[i].commits[0][j].commitedDate.getMonth() +1,
            list[i].commits[0][j].commitedDate.getDate(),
          ].join('-');
          result[date] = result[date] || 0;
          result[date]++;
        }
      }
    }
    } else if (type == MERGE_REQUESTS) {
      // TODO: Merge Request logic
    } else if (type == CODE_REVIEWS) {
      for(i = 0; i < list.length; i++) {
        if (selectUser === list[i].author && (list[i].noteableType == "MergeRequest" || list[i].noteableType == "Commit")) {
          date = [list[i].createdDate.getFullYear(),
          list[i].createdDate.getMonth() + 1,
          list[i].createdDate.getDate(),
        ].join('-');
        result[date] = result[date] || 0;
        result[date] += list[i].wordCount;
        }
      }
    } else if (type == ISSUES) {
      for(i = 0; i < list.length; i++) {
        if (selectUser === list[i].author && list[i].noteableType == "Issue") {
          date = [list[i].createdDate.getFullYear(),
          list[i].createdDate.getMonth() + 1,
          list[i].createdDate.getDate(),
        ].join('-');
        result[date] = result[date] || 0;
        result[date] += list[i].wordCount;
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
  var dailyCommitsArray = countDates(userCommitsList, COMMITS)
  var commitDatesArray = populateDates(dailyCommitsArray)
  var commitCountsArray = populateCounts(dailyCommitsArray)

  // Merge Request logic not complete - commits as placeholder
  var dailyMRsArray = countDates(userCommitsList, COMMITS)
  var mrDatesArray = populateDates(dailyMRsArray)
  var mrCountsArray = populateCounts(dailyMRsArray)

  var dailyCRArray = countDates(notesList, CODE_REVIEWS)
  var CRDatesArray = populateDates(dailyCRArray)
  var CRCountsArray = populateCounts(dailyCRArray)

  var dailyIssuesArray = countDates(notesList, ISSUES)
  var issueDatesArray = populateDates(dailyIssuesArray)
  var issueCountsArray = populateCounts(dailyIssuesArray)

  // will need dates based on snapshot taken from context
  const [dateArray, setDateArray] = useState(commitDatesArray);
  const [crDateArray, setCrDateArray] = useState(CRDatesArray);
  const [issueDateArray, setIssueDateArray] = useState(issueDatesArray);

  useEffect(() => {
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
    setCrDateArray(CRDatesArray)
    setIssueDateArray(issueDatesArray)
  }, [selectUser])

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
          data: [],
        },
        {
          data: [],
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
    } else if (e.key === 'crOwn') {
      setCrDropdown('Own');
      setCrSeries([
        {
          data: [],
        },
      ]);
    } else if (e.key === 'crOthers') {
      setCrDropdown('Others');
      setCrSeries([
        {
          data: [],
        },
      ]);
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
            Merge Request & Commit {textRender} from {startDate} - {endDate}
          </b>
        </Grid>
        <Grid item xs={10}>
          <StackedBarGraph series={combinedSeries} xlabel={commitDatesArray}/>
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
            Code Review Word Count from {startDate} to {endDate}
          </b>
        </Grid>
        <Grid item xs={10}>
          <BarGraph series={crSeries} colors={'#f8f0d4'} stroke={'#CBB97B'} xlabel={CRDatesArray} id={2}/>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <Dropdown overlay={crMenu}>
            <Button>
              {crDropdown} <DownOutlined />
            </Button>
          </Dropdown>
        </Grid>
        <Grid item xs={12}>
          <b>
            Issue Word Count from {startDate} to {endDate}
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
