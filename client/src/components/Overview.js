import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'

{/* could probably move some of this stuff into other components */}

const useStyles = makeStyles((theme) =>({
    grid: {
      width: '100%',
      margin:'0px'
    },
    paper: {
      padding: theme.spacing(3),
      textAlign: 'left',
      height: '90%',
      border: '',
    },
  }));

const Overview = () => {
    const classes = useStyles();
    return (
        <div>
            <Grid container spacing={2} className={classes.grid}>
            <Grid item xs={9}>
                <Paper className={ classes.paper}>
                    <Typography variant="h6">
                        Graph and stuff go here
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper className={ classes.paper}>
                    <Typography variant="h6">
                        Buttons + Graph legend goes here
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={ classes.paper}>
                    <Typography variant="h6">
                        Another graph goes here
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={ classes.paper}>
                    <Typography variant="h6">
                        Another graph goes here
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={ classes.paper}>
                    <Typography variant="h6">
                        @everyone Code Score: 0
                    </Typography>
                    <Typography variant="h6">
                        @user1 Code Score: 0
                    </Typography>
                    <Typography variant="h6">
                        @user2 Code Score: 0
                    </Typography>
                    <Typography variant="h6">
                        @user3 Code Score: 0
                    </Typography>
                    <Typography variant="h6">
                        @user4 Code Score: 0
                    </Typography>
                </Paper>
            </Grid>
            </Grid>
        </div>
    )
}

export default Overview
