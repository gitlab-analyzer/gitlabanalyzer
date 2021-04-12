import { React, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Stats from '../components/table/Stats';
import Header from '../components/Header';
import FooterBar from '../components/FooterBar';

import { useAuth } from '../context/AuthContext';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#f8f9fa',
    fontFamily: 'Comfortaa',
  },
  body: {
    fontFamily: 'Comfortaa',
  },
}))(TableCell);

const CommentTableCell = withStyles((theme) => ({
  body: {
    fontFamily: 'Comfortaa',
    fontSize: '12px'
  },
}))(TableCell);

const useStyles = makeStyles({
  root: {
    margin: '50px',
    fontFamily: 'Comfortaa',
  },
  table: {
    minWidth: 650,
  },
  grid: {
    width: '100%',
    margin: '0px',
    textAlign: 'left',
    paddingBottom: '50px',
  },
});



function createData(date, wordcount, comment, ownership, type) {
  return { date, wordcount, comment, ownership, type };
}


const TablePage = () => {
  const { 
    selectUser, 
    notesList, 
    dataList,
    setWordCount,
    setCrCount,
    setOwnCount,
    setOtherCount,
    setIssueCount
  } = useAuth()
  const classes = useStyles();
  
  // This is the date formatter that formats in the form: Mar 14 @ 8:30pm if same year
  // if not, Mar 14 2020 @ 8:30pm
  const dateFormatter = (dateObject) => {
    let today = new Date();
    let ampm = '';
    let thisYear = today.getFullYear();
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let month = dateObject.getMonth();
    let day = dateObject.getDate();
    let year = dateObject.getFullYear();
    let hour = dateObject.getHours();
    let minute = dateObject.getMinutes();

    if (hour === 0) {
      hour = 12;
      ampm = 'am';
    } else if (hour >= 13) {
      hour -= 12;
      ampm = 'pm';
    } else {
      ampm = 'am';
    }

    if (minute < 10) {
      minute = '0' + minute;
    }

    if (thisYear === year) {
      return `${months[month]} ${day} @ ${hour}:${minute}${ampm}`;
    } else {
      return `${months[month]} ${year} ${day} @ ${hour}:${minute}${ampm}`;
    }
  };

  const populateTable = (notes, dates) => {
    var i;
    var result = [];
    var type;
    var wordcount = 0;
    var crcount = 0;
    var issuecount = 0;
    var owncount = 0;
    var othercount = 0;
    for (i = 0; i < notes.length; i++) {
      if(dates.length !== 0) {
        if ((selectUser === notes[i].author) && (dates[0]._d <= notes[i].createdDate && notes[i].createdDate <= dates[1]._d)) {
          if(notes[i].ownership === "Own") {
            owncount += 1
          } else if(notes[i].ownership === "Other") {
            othercount += 1
          }
          if((notes[i].noteableType === "MergeRequest") || (notes[i].noteableType === "Commit")) {
            type = "Code Review"
            crcount += 1
          } else {
            type = "Issue"
            issuecount += 1
          }
          wordcount += notes[i].wordCount
          result.push(createData(dateFormatter(
           notes[i].createdDate),
           notes[i].wordCount, 
           notes[i].body, 
           notes[i].ownership, 
           type))
        }
      } else {
        if(selectUser === notes[i].author) {
          if(notes[i].ownership === "Own") {
            owncount += 1
          } else if(notes[i].ownership === "Other") {
            othercount += 1
          }
          if((notes[i].noteableType === "MergeRequest") || (notes[i].noteableType === "Commit")) {
            type = "Code Review"
            crcount += 1
          } else {
            type = "Issue"
            issuecount += 1
          }
          wordcount += notes[i].wordCount
          result.push(
            createData(dateFormatter(notes[i].createdDate), 
            notes[i].wordCount, 
            notes[i].body, 
            notes[i].ownership, 
            type))
        }
      }
    }
      return [result, wordcount, crcount, owncount, othercount, issuecount];
    }

  // Table updates based on state of this
  var values  = populateTable(notesList, dataList);
  var rows = values[0];

  useEffect(() => {
    setWordCount(values[1])
    setCrCount(values[2])
    setOwnCount(values[3])
    setOtherCount(values[4])
    setIssueCount(values[5])
  }, [selectUser, dataList]);

  return (
    <>
      <Header />
      <div className="open-sans">
        <Grid container className={classes.grid}>
          <Grid item xs={9}>
            <TableContainer component={Paper} elevation={0}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{ width: '20%' }}>Date</StyledTableCell>
                    <StyledTableCell align="right">Word Count</StyledTableCell>
                    <StyledTableCell style={{ width: '50%' }} align="left">
                      Comment
                    </StyledTableCell>
                    <StyledTableCell align="right">Ownership</StyledTableCell>
                    <StyledTableCell align="right">Type</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.date}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.wordcount}
                      </StyledTableCell>
                      <CommentTableCell size="medium" align="left">
                        {row.comment}
                      </CommentTableCell>
                      <StyledTableCell align="right">
                        {row.ownership}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.type}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={3} style={{ textAlign: 'center' }} component={Paper} elevation={0}>
            <Stats />
          </Grid>
        </Grid>
      </div>
      <FooterBar />
    </>
  );
};

export default TablePage;
