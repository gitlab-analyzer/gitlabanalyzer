import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import BarGraph from '../components/summary/BarGraph'
import { Menu, Dropdown, Button } from 'antd';
import {DownOutlined} from '@ant-design/icons'
import 'antd/dist/antd.css';
import StackedBarGraph from '../components/summary/StackedBar'

/* could probably move some of this stuff into other components */

const useStyles = makeStyles((theme) =>({
    root: {
        fontFamily: 'Comfortaa'
    },
    grid: {
      width: '100%',
      margin:'0px',
      padding: 25,
      paddingBottom: 25,
      textAlign: 'left',
    }
  }));

const Summary = () => {
    const [startDate, setStartDate] = useState('Jan 2021')
    const [endDate, setEndDate] = useState('Mar 2021')

    const [combinedDropdown, setCombinedDropdown] = useState('Number')
    const [crDropdown, setCrDropdown] = useState('All')
    const [textRender, setTextRender] = useState('Number')
    const classes = useStyles();

    // will be replaced once we find out how to get data from backend
    const data = [44, 55, 41, 67, 22, 43, 0, 30, 10, 10, 44, 55, 41, 43, 0, 30, 10, 10, 43, 0, 30, 10, 10]

    const data2 = [55, 41, 43, 0, 30, 10, 10, 43, 0, 30, 10, 10, 44, 44, 55, 41, 67, 22, 43, 0, 30, 10, 10]

    const data3 = [10, 44, 55, 41, 43, 0, 30, 10, 10, 10, 44, 44, 55, 41, 67, 22, 10, 44, 44, 55, 41, 55, 41]

    const [combinedSeries, setCombinedSeries] = useState([{
      name: "Merge Requests",
      data: data
    }, {
      name: "Commits",
      data: data2
    }
])

    const [crSeries, setCrSeries] = useState([{
      name: "Code Review Words",
      data: data
    }
    ])

    const [issueSeries, setIssueSeries] = useState([{
      name: "Issue Words",
      data: data
    }
    ])

    const handleMenuClick = (e) => {
      console.log('Key test:', e);

      if(e.key === "Num") {
        setCombinedDropdown("Number")
        setCombinedSeries([{
          data: data
        },{
          data: data2
        }
        ])
        setTextRender('Number')
      } else if(e.key === "Score") {
        setCombinedDropdown("Score")
        setCombinedSeries([{
          data: data2
        }, {
          data: data
        }
        ])
        setTextRender('Score')
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

    const combinedMenu = (
      <Menu onClick={handleMenuClick} >
        <Menu.Item key="Num">Number</Menu.Item>
        <Menu.Item key="Score">Score</Menu.Item>
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
                          <b>Merge Request & Commit {textRender} from {startDate} to {endDate}</b>
              </Grid>
              <Grid item xs={10}>
                          <StackedBarGraph series={combinedSeries} />
              </Grid>
              <Grid item xs={1}>
              </Grid>
              <Grid item xs={1}>
                <Dropdown overlay={combinedMenu}>
                  <Button>
                    {combinedDropdown} <DownOutlined />
                  </Button>
                </Dropdown>
              </Grid>
              <Grid item xs={12}>                    
                <b>Code Review Word Count from {startDate} to {endDate}</b>
              </Grid>
              <Grid item xs={10}>
                <BarGraph series={crSeries} colors={'#f8f0d4'} stroke={'#CBB97B'}/>
              </Grid>
              <Grid item xs={1}>
              </Grid>
              <Grid item xs={1}>
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
                <BarGraph series={issueSeries} colors={'#d4d8f8'} stroke={'#7F87CF'}/>
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
        </div>
    )
}

export default Summary
