import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import StackedBar from './StackedBar'
import Heatmap from './Heatmap'

{/* could probably move some of this stuff into other components */}

const useStyles = makeStyles((theme) =>({
    grid: {
      width: '100%',
      margin:'0px',
      backgroundColor: '#E4E8EF',
    },
    paper: {
      padding: theme.spacing(4),
      textAlign: 'left',
      height: '90%',
      border: '',
      backgroundColor: '#E4E8EF',
    },
  }));

const Overview = () => {
    const classes = useStyles();
    return (
        <div>
            <Grid container className={classes.grid}>
            <Grid item xs={10}>
                <Paper className={ classes.paper}>
                        <StackedBar />
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <Paper className={ classes.paper}>
                    <Typography variant="h6">
                        Button goes here
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={10}>
                
            </Grid>
            <Grid item xs={12}>
                <Paper className={ classes.paper}>
                    <Typography variant="h6">
                        <Heatmap />
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={ classes.paper}>
                    <Typography variant="h6">
                        Top 10 Merge Requests and Commits
                        <ul>
                            <li>@user1: Code Score of 10000, 100 additions, 0 deletions</li>
                            <li>@user2: Code Score of 500, 2 additions, 0 deletions</li>
                            <li>@user3: Code Score of 1, 1 additions, 0 deletions</li>
                        </ul>
                    </Typography>
                </Paper>
            </Grid>

            </Grid>
        </div>
    )
}

export default Overview
