import {React, useState } from 'react';
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
  const [tableNotesList, setTableNotesList] = useState(notesList)
  const classes = useStyles();

  const dataRows = [];
  console.log(tableNotesList)
  tableNotesList.forEach((item, i) => {
    console.log(item[i])
    console.log()
    // if(item[i].author == selectUser){
    //  dataRows.push(createData(item[i].createdDate, item[i].wordCount, item[i].body, "N/A", "N/A"));
    // }
    // console.log(dataRows)
  });

  return (
    <>
      <Header />
      <SelectUser />
      <div className="open-sans">
        <Grid container className={classes.grid}>
          <Grid item xs={9}>
            <TableContainer component={Paper}>
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
                  {dataRows.map((row) => (
                    <TableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {dataRows.date}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {dataRows.wordcount}
                      </StyledTableCell>
                      <StyledTableCell size="medium" align="left">
                        {dataRows.comment}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {dataRows.ownership}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {dataRows.type}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={3} style={{ textAlign: 'center' }} component={Paper}>
            <FilterMenu />
          </Grid>
        </Grid>
      </div>
      <FooterBar />
    </>
  );
};

export default TablePage;
