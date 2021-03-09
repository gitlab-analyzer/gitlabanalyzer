import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root: {
      margin: '50px'
  },
  table: {
    minWidth: 650,
  },
});

function createData(date, wordcount, ownership, type) {
    return { date, wordcount, ownership, type}
}

const rows = [
  createData('01/01/2021', 15, 'Own', 'Code Review'),
  createData('01/01/2021', 2, 'Own', 'Issue'),
  createData('01/01/2021', 55, 'Other', 'Code Review'),
  createData('01/01/2021', 65, 'Own', 'Issue'),
  createData('01/01/2021', 44, 'Other', 'Code Review'),
  createData('01/01/2021', 111, 'Own', 'Code Review'),
  createData('01/01/2021', 15, 'Own', 'Code Review'),
  createData('01/01/2021', 2, 'Own', 'Issue'),
  createData('01/01/2021', 55, 'Other', 'Code Review'),
  createData('01/01/2021', 65, 'Own', 'Issue'),
  createData('01/01/2021', 44, 'Other', 'Code Review'),
  createData('01/01/2021', 111, 'Own', 'Code Review'),
];

// style={{width:300}}
const TablePage = () => {
    const classes = useStyles();
    return (
        <TableContainer component={Paper}>

            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Word Count</TableCell>
                    <TableCell align="right">Ownership</TableCell>
                    <TableCell align="right">Type</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                        {row.date}
                    </TableCell>
                    <TableCell align="right">{row.wordcount}</TableCell>
                    <TableCell align="right">{row.ownership}</TableCell>
                    <TableCell align="right">{row.type}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TablePage