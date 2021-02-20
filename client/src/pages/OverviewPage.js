import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import StackedBar from '../components/overview/StackedBarGraph'
import Heatmap from '../components/overview/Heatmap'
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
    }
  }));

const Overview = () => {
    const [startDate, setStartDate] = useState('Jan 2021')
    const [endDate, setEndDate] = useState('Mar 2021')
    const [menuSelection, setMenuSelection] = useState('Commits')
    const classes = useStyles();

    // will be replaced once we find out how to get data from backend
    const data = [[44, 55, 41, 67, 22, 43, 0, 30, 10, 10], 
                    [13, 23, 20, 8, 13, 27, 0, 30, 10, 10],
                    [11, 17, 15, 15, 21, 14, 0, 30, 10, 10],
                    [21, 7, 25, 13, 22, 8, 0, 30, 10, 10],
                    [44, 55, 41, 67, 22, 43, 0, 30, 10, 10], 
                    [13, 23, 20, 8, 13, 27, 0, 30, 10, 10],
                    [11, 17, 15, 15, 21, 14, 0, 30, 10, 10],
                    [21, 7, 25, 13, 22, 8, 0, 30, 10, 10]
                   ];

    const [series, setSeries] = useState([{
      name: '@bfraser',
      data: data[0]
    }, {
      name: '@khangura',
      data: data[1]
    }, {
      name: '@gbaker',
      data: data[2]
    }, {
      name: '@afraser',
      data: data[3]
    }, {
      name: '@cfraser',
      data: data[0]
    }, {
      name: '@dfraser',
      data: data[1]
    }, {
      name: '@efraser',
      data: data[2]
    }, {
      name: '@ffraser',
      data: data[3]
    }
    ])

    const handleMenuClick = (e) => {
      console.log('Key test:', e);
      if(e.key === "commits") {
        setMenuSelection("Commits")
        setSeries([{
          name: '@bfraser',
          data: data[0]
        }, {
          name: '@khangura',
          data: data[1]
        }, {
          name: '@gbaker',
          data: data[2]
        }, {
          name: '@afraser',
          data: data[3]
        }, {
          name: '@cfraser',
          data: data[0]
        }, {
          name: '@dfraser',
          data: data[1]
        }, {
          name: '@efraser',
          data: data[2]
        }, {
          name: '@ffraser',
          data: data[3]
        }
        ])
      } else if (e.key === "mergereqs") {
        setMenuSelection("Merge Reqs")
        setSeries([{
          name: '@bfraser',
          data: data[6]
        }, {
          name: '@khangura',
          data: data[3]
        }, {
          name: '@gbaker',
          data: data[1]
        }, {
          name: '@afraser',
          data: data[4]
        }, {
          name: '@cfraser',
          data: data[5]
        }, {
          name: '@dfraser',
          data: data[0]
        }, {
          name: '@efraser',
          data: data[1]
        }, {
          name: '@ffraser',
          data: data[3]
        }
        ])
      } else if (e.key ==="issues") {
        setMenuSelection("Issues")
        setSeries([{
          name: '@bfraser',
          data: data[3]
        }, {
          name: '@khangura',
          data: data[5]
        }, {
          name: '@gbaker',
          data: data[3]
        }, {
          name: '@afraser',
          data: data[2]
        }, {
          name: '@cfraser',
          data: data[1]
        }, {
          name: '@dfraser',
          data: data[6]
        }, {
          name: '@efraser',
          data: data[3]
        }, {
          name: '@ffraser',
          data: data[2]
        }
        ])
      } else {
        setSeries([{
          name: '@bfraser',
          data: data[1]
        }, {
          name: '@khangura',
          data: data[1]
        }, {
          name: '@gbaker',
          data: data[3]
        }, {
          name: '@afraser',
          data: data[3]
        }, {
          name: '@cfraser',
          data: data[3]
        }, {
          name: '@dfraser',
          data: data[5]
        }, {
          name: '@efraser',
          data: data[5]
        }, {
          name: '@ffraser',
          data: data[6]
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
                        <b>Commit Count from {startDate} to {endDate}</b>
            </Grid>
            <Grid item xs={10}>
                        <StackedBar series={series}/>
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
