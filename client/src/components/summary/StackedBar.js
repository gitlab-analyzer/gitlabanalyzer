import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import apexchart from "apexcharts"

// adapted from: https://apexcharts.com/react-chart-demos/column-charts/stacked/

class StackedBarGraph extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
      
        options: {
          colors: [ '#E2F0CB', '#C7EBFF'],
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: [ '#7dab31', '#6AB1D9'],
            width: 1,
            dashArray: 0,      
        },
          chart: {
            fontFamily: 'Comfortaa',
            id: 1,
            toolbar: {
              show: false
            },
            stacked: true,
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
            categories: this.props.xlabel,
          },
          yaxis: {
            decimalsInFloat: 1
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
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

    componentDidUpdate() {
      // Update the series and xaxis
      apexchart.exec("1", "updateOptions", {
        series: this.props.series,
        xaxis: {
          categories: this.props.xlabel
        }
      });
    }

    render() {
      return (
        <div id="chart">
          <Chart options={this.state.options} series={this.props.series} type="bar" height={350} />
        </div>
      );
    }
  }

export default StackedBarGraph