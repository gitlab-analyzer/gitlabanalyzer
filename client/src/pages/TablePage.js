import {React, useState, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button } from 'antd'

import FilterMenu from '../components/table/FilterMenu';
import SelectUser from '../components/SelectUser';
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
  const { selectUser, setSelectUser, notesList, setNotesList} = useAuth()
  const classes = useStyles();

  const populateTable = (notes) => {
    var i,j, result = [];
    var type, date;
    for (i = 0; i < notes.length; i++) {
      if (selectUser === notes[i].author) {
        if(notes[i].noteableType === "MergeRequest" || notes[i].noteableType === "Commit") {
          type = "Code Review"
        } else {
          type = "Issue"
        }
        date = [
          notes[i].createdDate.getFullYear(),
          notes[i].createdDate.getMonth() +1,
          notes[i].createdDate.getDate(),
        ].join('-');
        result.push(createData(date, notes[i].wordCount, notes[i].body, "author", type))
        }
      }
      return result;
    }

  // Table updates based on state of this
  var rows = populateTable(notesList)

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
                    <StyledTableCell>Date</StyledTableCell>
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
                      <StyledTableCell size="medium" align="left">
                        {row.comment}
                      </StyledTableCell>
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
            <FilterMenu />
          </Grid>
        </Grid>
      </div>
      <FooterBar />
    </>
  );
};

export default TablePage;
