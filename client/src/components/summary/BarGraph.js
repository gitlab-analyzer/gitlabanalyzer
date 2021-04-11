import React, { Component } from 'react';
import Chart from 'react-apexcharts'
import apexchart from "apexcharts"

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
            fontFamily: 'Comfortaa',
            id: this.props.id,
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
            categories: this.props.xlabel
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
      var chartID = this.props.id.toString()
      apexchart.exec(chartID, "updateOptions", {
        series: this.props.series,
        xaxis: {
          categories: this.props.xlabel
        }
      });
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