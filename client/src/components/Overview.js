import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import StackedBar from './StackedBarGraph'
import Heatmap from './Heatmap'
import GraphDropdown from './GraphDropdown'
import { Menu, Dropdown, Button } from 'antd';
import {DownOutlined} from '@ant-design/icons'
import 'antd/dist/antd.css';


{/* could probably move some of this stuff into other components */}

const useStyles = makeStyles((theme) =>({
    root: {
        fontFamily: 'Comfortaa'
    },
    grid: {
      width: '100%',
      margin:'0px',
      backgroundColor: '#E4E8EF',
      padding: 25,
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
    const [startDate, setStartDate] = useState('Jan 2021')
    const [endDate, setEndDate] = useState('Mar 2021')
    const [menuSelection, setMenuSelection] = useState('Commits')
    const classes = useStyles();

    const handleMenuClick = (e) => {
      console.log('Key test:', e);
      if(e.key == "commits") {
        setMenuSelection("Commits")
      } else if (e.key == "mergereqs") {
        setMenuSelection("Merge Reqs")
      } else if (e.key =="issues") {
        setMenuSelection("Issues")
      } else {
        setMenuSelection("Reviews")
      }
 
    };

    const menu = (
      <Menu onClick={handleMenuClick} >
        <Menu.Item key="commits">Commits</Menu.Item>
        <Menu.Item key="mergereqs">Merge Reqs</Menu.Item>
        <Menu.Item key="issues">Issues</Menu.Item>
        <Menu.Item key="code_reviews">Reviews</Menu.Item>
      </Menu>
    )
    return (
        <div>
            <Grid container className={classes.grid}>
            <Grid item xs={12}>                    
                        <b>Commit Count from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                        <StackedBar />
            </Grid>
            <Grid item xs={2}>
                      <Dropdown overlay={menu}>
                <Button>
                  {menuSelection} <DownOutlined />
                </Button>
              </Dropdown>
            </Grid>
            <Grid item xs={12}>                    
                        <b>x Lifetime Contributions</b>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
                        <Heatmap />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={12}>
                        <b>Top 10 Merge Requests and Commits</b>
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
