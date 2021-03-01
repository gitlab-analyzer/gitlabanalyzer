import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import BarGraph from '../components/overview/BarGraph'
import { Menu, Dropdown, Button } from 'antd';
import {DownOutlined} from '@ant-design/icons'
import 'antd/dist/antd.css';


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

    const [mrDropdown, setMrDropdown] = useState('Number')
    const [commitDropdown, setCommitDropdown] = useState('Number')
    const [crDropdown, setCrDropdown] = useState('All')
    const classes = useStyles();

    // will be replaced once we find out how to get data from backend
    const data = [44, 55, 41, 67, 22, 43, 0, 30, 10, 10, 44, 55, 41, 43, 0, 30, 10, 10, 43, 0, 30, 10, 10]

    const data2 = [55, 41, 43, 0, 30, 10, 10, 43, 0, 30, 10, 10, 44, 44, 55, 41, 67, 22, 43, 0, 30, 10, 10]

    const data3 = [10, 44, 55, 41, 43, 0, 30, 10, 10, 10, 44, 44, 55, 41, 67, 22, 10, 44, 44, 55, 41, 55, 41]


    const [mrSeries, setMrSeries] = useState([{
      data: data
    }
    ])

    const [commitSeries, setCommitSeries] = useState([{
      data: data
    }
    ])

    const [crSeries, setCrSeries] = useState([{
      data: data
    }
    ])

    const [issueSeries, setIssueSeries] = useState([{
      data: data
    }
    ])

    const handleMenuClick = (e) => {
      console.log('Key test:', e);

      if(e.key === "mrNum") {
        setMrDropdown("Number")
        setMrSeries([{
          data: data
        }
        ])
      } else if(e.key === "mrScore") {
        setMrDropdown("Score")
        setMrSeries([{
          data: data2
        }
        ])
      } else if(e.key === "commitNum") {
        setCommitDropdown("Commits")
        setCommitSeries([{
          data: data
        }
        ])
      } else if (e.key === "commitScore") {
        setCommitDropdown("Score")
        setCommitSeries([{
          data: data3
        }
        ])
      } else if (e.key ==="crAll") {
        setCrDropdown("All")
        setCrSeries([{
          data: data
        }
        ])
      } else if (e.key === "crOwn") {
        setCrDropdown("Own")
        setCrSeries([{
          data: data2
        }
        ])
      } else if (e.key === "crOthers") {
        setCrDropdown("Others")
        setCrSeries([{
          data: data3
        }
        ])
      }
 
    };

    const mrMenu = (
      <Menu onClick={handleMenuClick} >
        <Menu.Item key="mrNum">Number</Menu.Item>
        <Menu.Item key="mrScore">Score</Menu.Item>
      </Menu>
    )

    const commitMenu = (
      <Menu onClick={handleMenuClick} >
        <Menu.Item key="commitNum">Number</Menu.Item>
        <Menu.Item key="commitScore">Score</Menu.Item>
      </Menu>
    )

    const crMenu = (
      <Menu onClick={handleMenuClick} >
        <Menu.Item key="crAll">All</Menu.Item>
        <Menu.Item key="crOwn">Own</Menu.Item>
        <Menu.Item key="crOthers">Others</Menu.Item>
      </Menu>
    )

    return (
        <div>
            <Grid container className={classes.grid}>
            <Grid item xs={12}>                    
                        <b>Merge Request Score from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                        <BarGraph series={mrSeries} colors={'#C7EBFF'} stroke={'#6AB1D9'}/>
            </Grid>
            <Grid item xs={2}>
                      <Dropdown overlay={mrMenu}>
                <Button>
                  {mrDropdown} <DownOutlined />
                </Button>
              </Dropdown>
            </Grid>
            <Grid item xs={12}>                    
                        <b>Commit Score from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                      <BarGraph series={commitSeries} colors={'#ABF1DC'} stroke={'#1db084'}/>
            </Grid>
            <Grid item xs={2}>
                      <Dropdown overlay={commitMenu}>
                <Button>
                  {commitDropdown} <DownOutlined />
                </Button>
              </Dropdown>
            </Grid>
            <Grid item xs={12}>                    
                        <b>Code Review Word Count from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                        <BarGraph series={crSeries} colors={'#F1E2AB'} stroke={'#CBB97B'}/>
            </Grid>
            <Grid item xs={2}>
                      <Dropdown overlay={crMenu}>
                <Button>
                  {crDropdown} <DownOutlined />
                </Button>
              </Dropdown>
            </Grid>
            <Grid item xs={12}>                    
                        <b>Issue Word Count from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                        <BarGraph series={issueSeries} colors={'#ABB2F1'} stroke={'#7F87CF'}/>
            </Grid>
            <Grid item xs={2}>
            </Grid>

            </Grid>
        </div>
    )
}

export default Overview
