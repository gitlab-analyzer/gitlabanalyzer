import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { Checkbox } from 'antd';
import { InputNumber } from 'antd';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: '#f8f9fa',
      fontFamily: 'Comfortaa'
    },
    body: {
      fontFamily: 'Comfortaa'
    }
  }))(TableCell);

const useStyles = makeStyles({
  root: {
      margin: '50px',
      fontFamily: 'Comfortaa'
  },
  table: {
    minWidth: 650,
  },
  grid: {
    width: '100%',
    margin:'0px',
    textAlign: 'left',
    paddingBottom: '50px',
  },
  button: {
    paddingTop: '10px',
    paddingBottom: '20px'
  },
  filterText: {
    paddingTop: '15px'
  },
});

function createData(date, wordcount, comment, ownership, type) {
    return { date, wordcount, comment,ownership, type}
}

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

const rows = [
  createData('01/01/2021', 15, 'asdf', 'Own', 'Code Review'),
  createData('01/01/2021', 2, 'asdf','Own', 'Issue'),
  createData('01/01/2021', 55, 'asdf','Other', 'Code Review'),
  createData('01/01/2021', 65, 'asdf','Own', 'Issue'),
  createData('01/01/2021', 44, 'asdf','Other', 'Code Review'),
  createData('01/01/2021', 111,'asdf', 'Own', 'Code Review'),
  createData('01/01/2021', 15,'asdf', 'Own', 'Code Review'),
  createData('01/01/2021', 2,'asdf', 'Own', 'Issue'),
  createData('01/01/2021', 55,'asdf', 'Other', 'Code Review'),
  createData('01/01/2021', 65,'asdf', 'Own', 'Issue'),
  createData('01/01/2021', 44, 'asdf','Other', 'Code Review'),
  createData('01/01/2021', 111,'asdf', 'Own', 'Code Review'),
];

const TablePage = () => {
    const classes = useStyles();
    return (
        <div className="open-sans">
        <Grid container className={classes.grid}>
            <Grid item xs={9}>   
                <TableContainer component={Paper}>

                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell align="right">Word Count</StyledTableCell>
                            <StyledTableCell align="right">Comment</StyledTableCell>
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
                            <StyledTableCell align="right">{row.wordcount}</StyledTableCell>
                            <StyledTableCell align="right">{row.comment}</StyledTableCell>
                            <StyledTableCell align="right">{row.ownership}</StyledTableCell>
                            <StyledTableCell align="right">{row.type}</StyledTableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={3} style={{textAlign: 'center'}} component={Paper}>
                <h4 className={classes.filterText}><b>Filter</b></h4>
                <h6 className={classes.filterText}>Word Count</h6>
                <p className={classes.filterText}>Min&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max</p>
                <InputNumber className={classes.input} min={0} max={100} defaultValue={0} onChange={onChange} />
                <InputNumber className={classes.input}min={0} max={100} defaultValue={100} onChange={onChange} />
                <h6 className={classes.filterText}>Ownership</h6>
                
                <Checkbox className={classes.button} onChange={onChange} checked="true">Own</Checkbox>
                <Checkbox className={classes.button} onChange={onChange} checked="true">Other</Checkbox>

                <h6>Type</h6>
                <Checkbox className={classes.button} onChange={onChange} checked="true">Code Review</Checkbox>
                <Checkbox className={classes.button} onChange={onChange} checked="true">Issue</Checkbox>
            </Grid>
        </Grid>
        </div>
    )
}

export default TablePage