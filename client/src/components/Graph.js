import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Graph extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: '@user1',
          data: [44, 55, 41, 67, 22, 43]
        }, {
          name: '@user2',
          data: [13, 23, 20, 8, 13, 27]
        }, {
          name: '@user3',
          data: [11, 17, 15, 15, 21, 14]
        }, {
          name: '@user4',
          data: [21, 7, 25, 13, 22, 8]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
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
            },
          },
          xaxis: {
            type: 'datetime',
            categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
              '01/05/2011 GMT', '01/06/2011 GMT'
            ],
          },
          legend: {
            position: 'right',
            offsetY: 40
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

export default Graph