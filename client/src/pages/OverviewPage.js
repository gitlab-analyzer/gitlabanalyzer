import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import StackedBar from '../components/overview/StackedBarGraph'
import Heatmap from '../components/overview/Heatmap'
import { Menu, Dropdown, Button } from 'antd';
import {DownOutlined} from '@ant-design/icons'
import 'antd/dist/antd.css';
import IndividualScore from '../components/floatbar/IndividualScore'


/* could probably move some of this stuff into other components */

const useStyles = makeStyles((theme) =>({
    root: {
        fontFamily: 'Comfortaa'
    },
    grid: {
      width: '100%',
      margin:'0px',
      padding: 25,
      textAlign: 'left',
    }
  }));

const Overview = () => {
    const [startDate, setStartDate] = useState('Jan 2021')
    const [endDate, setEndDate] = useState('Mar 2021')
    const [menuSelection, setMenuSelection] = useState('Toggle')
    const classes = useStyles();

    // will be replaced once we find out how to get data from backend
    const data = [44, 55, 41, 67, 22, 43, 0, 30, 10, 10, 44, 55, 41, 43, 0, 30, 10, 10, 43, 0, 30, 10, 10]


    const [series, setSeries] = useState([{
      data: data
    }
    ])

    const handleMenuClick = (e) => {
      console.log('Key test:', e);
      if(e.key === "commits") {
        setMenuSelection("Commits")
        setSeries([{
          data: data
        }
        ])
      } else if (e.key === "mergereqs") {
        setMenuSelection("Merge Reqs")
        setSeries([{
          data: data
        }
        ])
      } else if (e.key ==="issues") {
        setMenuSelection("Issues")
        setSeries([{
          data: data
        }
        ])
      } else {
        setSeries([{
          data: data
        }
        ])
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
              <IndividualScore />
            </Grid>
            <Grid item xs={12}>                    
                        <b>Merge Request Score from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                        <StackedBar series={series} colors={'#C7EBFF'} stroke={'#6AB1D9'}/>
            </Grid>
            <Grid item xs={2}>
                      <Dropdown overlay={menu}>
                <Button>
                  {menuSelection} <DownOutlined />
                </Button>
              </Dropdown>
            </Grid>
            <Grid item xs={12}>                    
                        <b>Commit Score from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                      <StackedBar series={series} colors={'#ABF1DC'} stroke={'#1db084'}/>
            </Grid>
            <Grid item xs={2}>
                      <Dropdown overlay={menu}>
                <Button>
                  {menuSelection} <DownOutlined />
                </Button>
              </Dropdown>
            </Grid>
            <Grid item xs={12}>                    
                        <b>Code Review Word Count from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                        <StackedBar series={series} colors={'#F1E2AB'} stroke={'#CBB97B'}/>
            </Grid>
            <Grid item xs={2}>
                      <Dropdown overlay={menu}>
                <Button>
                  {menuSelection} <DownOutlined />
                </Button>
              </Dropdown>
            </Grid>
            <Grid item xs={12}>                    
                        <b>Commit Count from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                        <StackedBar series={series} colors={'#ABB2F1'} stroke={'#7F87CF'}/>
            </Grid>
            <Grid item xs={2}>
                      <Dropdown overlay={menu}>
                <Button>
                  {menuSelection} <DownOutlined />
                </Button>
              </Dropdown>
            </Grid>

            </Grid>
        </div>
    )
}

export default Overview
