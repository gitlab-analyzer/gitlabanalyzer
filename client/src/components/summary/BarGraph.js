import React, { Component } from 'react';
import Chart from 'react-apexcharts'

// adapted from: https://apexcharts.com/react-chart-demos/column-charts/stacked/

class BarGraph extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
      
        options: {
          colors: [this.props.colors],
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: [this.props.stroke],
            width: 1,
            dashArray: 0,      
        },
          chart: {
            toolbar: {
              show: false
            },
            type: 'bar',
            height: 350,
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
            type: 'datetime',
            categories: ["2021-3-1", "2021-3-2", 
            "2021-3-3", "2021-3-4","2021-3-5","2021-3-6", "2021-3-7",
            "2021-3-8", "2021-3-9","2021-3-10","2021-3-11", "2021-3-12"],
          },
          fill: {
            type: 'solid',
            opacity: 1
          }
        },
      };
    }

    render() {
      return (
        <div id="chart">
          <Chart options={this.state.options} series={this.props.series} type="bar" height={200} />
        </div>
      );
    }
  }

export default BarGraph