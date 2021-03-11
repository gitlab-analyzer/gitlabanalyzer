import React from 'react'

import { Checkbox } from 'antd';
import { InputNumber } from 'antd';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    button: {
      paddingTop: '10px',
      paddingBottom: '20px'
    },
    grid: {
        width: '100%',
        margin:'0px',
        textAlign: 'center',
    },
    filterText: {
      paddingTop: '15px'
    },
  });

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
}

const FilterMenu = () => {
    const classes = useStyles();
    return (
        <div>
            <Grid container className={classes.grid}>
                <Grid item xs={12}>
                    <h4 className={classes.filterText}><b>Filter</b></h4>
                    <h6 className={classes.filterText}>Word Count</h6>
                </Grid>
                <Grid item xs={12}>
                    <p className={classes.filterText}>Min&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max</p>
                </Grid>
                <Grid item xs={12}>
                    <InputNumber className={classes.input} min={0} max={100} defaultValue={0} onChange={onChange} />
                    <InputNumber className={classes.input}min={0} max={100} defaultValue={100} onChange={onChange} />
                </Grid>
                <Grid item xs={12}>
                    <h6 className={classes.filterText}>Ownership</h6>
                </Grid>
                <Grid item xs={12}>
                    <Checkbox className={classes.button} onChange={onChange} checked="true">Own</Checkbox>
                    <Checkbox className={classes.button} onChange={onChange} checked="true">Other</Checkbox>
                </Grid>
                <Grid item xs={12}>
                    <h6>Type</h6>
                </Grid>
                <Grid item xs={12}>
                    <Checkbox className={classes.button} onChange={onChange} checked="true">Code Review</Checkbox>
                    <Checkbox className={classes.button} onChange={onChange} checked="true">Issue</Checkbox>
                </Grid>
            </Grid>
        </div>
    )
}

export default FilterMenu
