import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Heatmap extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: 'Sunday',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5, 10, 15, 20, 50, 0, 0, 0, 30]
        },
        {
          name: 'Monday',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5, 10, 15, 20, 50, 0, 0, 0, 30]
        },
        {
          name: 'Tuesday',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5, 10, 15, 20, 50, 0, 0, 0, 30]
        },
        {
          name: 'Wednesday',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5, 10, 15, 20, 50, 0, 0, 0, 30]
        },
        {
          name: 'Thursday',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5, 10, 15, 20, 50, 0, 0, 0, 30]
        },
        {
          name: 'Friday',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5, 10, 15, 20, 50, 0, 0, 0, 30]
        },
        {
          name: 'Saturday',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5, 10, 15, 20, 50, 0, 0, 0, 30]
        }
        ],
        options: {
          chart: {
              toolbar: {
                show: false
              },
            height: 350,
            type: 'heatmap',
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#232948"],
          title: {
            text: '4444 contributions in the last year'
          },
        },
      
      
      };
    }

  

    render() {
      return (
        

  <div id="chart">
<Chart options={this.state.options} series={this.state.series} type="heatmap" height={200} />
</div>


      );
    }
  }

  export default Heatmap