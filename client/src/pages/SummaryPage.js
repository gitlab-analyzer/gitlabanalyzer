import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import BarGraph from '../components/summary/BarGraph';
import { Menu, Dropdown, Button } from 'antd';
import { DashOutlined, DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import StackedBarGraph from '../components/summary/StackedBar';
import SelectUser from '../components/SelectUser';
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
    setSelectUser,
    commitsList,
    setCommitsList,
    mergeRequestList,
    setMergeRequestList,
    notesList,
    setNotesList
  } = useAuth();
  const [startDate, setStartDate] = useState('March 1, 2021');
  const [endDate, setEndDate] = useState('March 12, 2021');

  const [combinedDropdown, setCombinedDropdown] = useState('Number');
  const [crDropdown, setCrDropdown] = useState('All');
  const [textRender, setTextRender] = useState('Number');

  const [userCommitsList, setUserCommitsList] = useState(commitsList);
  const [userMRList, setUserMRList] = useState(mergeRequestList)

  const classes = useStyles();

  console.log(notesList)
  console.log(commitsList)

  const countDates = (commitsList) => {
    var result = {},
      i,
      j,
      date,
      rarr = [];
    for (i = 0; i < commitsList.length; i++) {
      if (selectUser === commitsList[i].userName) {
        for (j = 0; j < commitsList[i].commits[0].length; j++) {
          date = [
            commitsList[i].commits[0][j].commitedDate.getFullYear(),
            commitsList[i].commits[0][j].commitedDate.getMonth() +1,
            commitsList[i].commits[0][j].commitedDate.getDate(),
          ].join('-');
          result[date] = result[date] || 0;
          result[date]++;
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

  const countIssues = (notesList) => {
    var result = {}, i, j, rarr = [],date;

    for(i = 0; i < notesList.length; i++) {
      if (selectUser === notesList[i].author) {
        date = [notesList[i].createdDate.getFullYear(),
        notesList[i].createdDate.getMonth() + 1,
        notesList[i].createdDate.getDate(),
      ].join('-');
      result[date] = result[date] || 0;
      result[date] += notesList[i].wordCount;
      }
    }
    for (i in result) {
      if (result.hasOwnProperty(i)) {
        rarr.push({ date: i, counts: result[i] });
      }
    }
    return rarr;
  }

  const populateDates = (array) => {
    var result = [],
      i;
    for (i in array) {
      result.push(array[i].date);
    }
    return result.reverse();
  };

  const populateCounts = (array) => {
    var newArray = [],
      i;
    for (i in array) {
      newArray.push(array[i].counts);
    }
    return newArray.reverse();
  };

  // Computations for graph data - fine to leave this here since it will be updated on selectUser
  var dailyCommitsArray = countDates(userCommitsList)
  var commitDatesArray = populateDates(dailyCommitsArray)
  var commitCountsArray = populateCounts(dailyCommitsArray)

  var dailyIssuesArray = countIssues(notesList)
  var issueDatesArray = populateDates(dailyIssuesArray)
  var issueCountsArray = populateCounts(dailyIssuesArray)

  console.log(issueDatesArray)
  console.log(issueCountsArray)


  var dailyMRsArray = countDates(userCommitsList)
  var mrDatesArray = populateDates(dailyMRsArray)
  var mrCountsArray = populateCounts(dailyMRsArray)

  // will need dates based on snapshot taken from context
  const [dateArray, setDateArray] = useState(commitDatesArray);

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
    setDateArray(commitDatesArray)
    console.log(dateArray)
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
          data: [],
        },
        {
          data: [],
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
          data: [],
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
          <BarGraph series={crSeries} colors={'#f8f0d4'} stroke={'#CBB97B'} />
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
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <FooterBar />
    </div>
  );
};

export default Summary;
