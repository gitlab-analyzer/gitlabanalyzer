import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import StackedBar from './StackedBar'
import Heatmap from './Heatmap'

{/* could probably move some of this stuff into other components */}

const useStyles = makeStyles((theme) =>({
    root: {
        fontFamily: 'Comfortaa'
    },
    grid: {
      width: '100%',
      margin:'0px',
      backgroundColor: '#E4E8EF',
      paddingTop: '20px',
      paddingLeft: '10px',
      textAlign: 'left',
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
            <Grid item xs={12}>                    
                    <Typography variant="h6">
                        Commit Count from x to y
                    </Typography>
            </Grid>
            <Grid item xs={10}>
                        <StackedBar />
            </Grid>
            <Grid item xs={2}>
                    <Typography variant="h6">
                        Button goes here
                    </Typography>
            </Grid>
            <Grid item xs={12}>                    
                    <Typography variant="h6">
                        x contributions in the past year
                    </Typography>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
                    <Typography variant="h6">
                        <Heatmap />
                    </Typography>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={12}>
                        Top 10 Merge Requests and Commits
                        <ol>
                            <li>@user1: Code Score of 10000, 100 additions, 0 deletions</li>
                            <li>@user2: Code Score of 500, 2 additions, 0 deletions</li>
                            <li>@user3: Code Score of 1, 1 additions, 0 deletions</li>
                        </ol>
            </Grid>

            </Grid>
        </div>
    )
}

export default Overview
