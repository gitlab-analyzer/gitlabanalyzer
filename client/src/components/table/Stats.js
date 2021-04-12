import React from 'react'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { useAuth } from '../../context/AuthContext';

const useStyles = makeStyles({
    button: {
      paddingTop: '5px',
      paddingBottom: '20px',
      textAlign: 'left'
    },
    grid: {
        width: '100%',
    },
    filterText: {
      paddingTop: '15px'
    },
  });

const Stats = () => {
    const classes = useStyles();
    const {
    wordCount,
    crCount,
    ownCount,
    otherCount,
    issueCount,
    } = useAuth();
    return (
        <div>
            <Grid container className={classes.grid} direction="column">
                <Grid item xs={12}>
                    <h4 className={classes.filterText}><b>Stats</b></h4>
                    <h6 className={classes.filterText}>Word Count: {wordCount}</h6>
                    <h6 className={classes.filterText}>Code Reviews: {crCount}</h6>
                    <h6 className={classes.filterText}>Issues: {issueCount}</h6>
                    <h6 className={classes.filterText}>CRs + Issues: {crCount + issueCount}</h6>

                    <br />
                    <h6 className={classes.filterText}>Own: {ownCount}</h6>
                    <h6 className={classes.filterText}>Other: {otherCount}</h6>
                </Grid>
            </Grid>
        </div>
    )
}

export default Stats;
