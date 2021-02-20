import React, { Component } from 'react';
import Chart from 'react-apexcharts'

// adapted from: https://apexcharts.com/react-chart-demos/column-charts/stacked/

class StackedBar extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
      
        options: {
          colors: ['#F1E2AB', '#ABB2F1', '#ABF1DC', '#C7EBFF', '#D7ECD9', '#F5D5CB', '#F6ECF5', '#F3DDF2'],
        //   stroke: {
        //     show: true,
        //     curve: 'smooth',
        //     lineCap: 'butt',
        //     colors: ['#CBB97B', '#7F87CF', '#55FFCC', '#6AB1D9', '#489850', '#bb4824', '#a34d9a', '#ab3ca6'],
        //     width: 1,
        //     dashArray: 0,      
        // },
          chart: {
            toolbar: {
              show: false
            },
            type: 'bar',
            height: 350,
            stacked: true,
          },
          dataLabels: {
            enabled: false
          },
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          plotOptions: {
            bar: {
              borderRadius: 8,
              horizontal: false,
              endingShape: 'flat'
            }
          },
          xaxis: {
            categories: ['J1', 'J2', 'J3', 'J4', 'F1',
            'F2', 'F3', 'F4', 'M1', 'M2'
            ],
          },
          legend: {
            position: 'right',
            offsetY: 40,
            onItemClick: {
              toggleDataSeries: false
            }
          },
          fill: {
            type: 'solid',
            opacity: 1
          }
        },
      
      
      };
    }

  

    render() {
      console.log(this.props)

      return (
        

  <div id="chart">
<Chart options={this.state.options} series={this.props.series} type="bar" height={350} />
</div>


      );
    }
  }

export default StackedBar