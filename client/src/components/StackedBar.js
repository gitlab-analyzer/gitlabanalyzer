import React, { Component } from 'react';
import Chart from 'react-apexcharts'

// adapted from: https://apexcharts.com/react-chart-demos/column-charts/stacked/

class StackedBar extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: '@user1',
          data: [44, 55, 41, 67, 22, 43, 0, 30, 10, 10]
        }, {
          name: '@user2',
          data: [13, 23, 20, 8, 13, 27, 0, 30, 10, 10]
        }, {
          name: '@user3',
          data: [11, 17, 15, 15, 21, 14, 0, 30, 10, 10]
        }, {
          name: '@user4',
          data: [21, 7, 25, 13, 22, 8, 0, 30, 10, 10]
        }],
        options: {
          colors: ['#C7EBFF', '#ABF1DC', '#ABB2F1', '#F1E2AB'],
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
            },
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
            opacity: 1
          }
        },
      
      
      };
    }

  

    render() {
      return (
        

  <div id="chart">
<Chart options={this.state.options} series={this.state.series} type="bar" height={350} />
</div>


      );
    }
  }

export default StackedBar