import React, { Component } from 'react';
import Chart from 'react-apexcharts'

// adapted from: https://apexcharts.com/react-chart-demos/column-charts/stacked/

class StackedBar extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
      
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
      console.log(this.props)

      return (
        

  <div id="chart">
<Chart options={this.state.options} series={this.props.series} type="bar" height={350} />
</div>


      );
    }
  }

export default StackedBar