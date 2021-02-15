import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Heatmap extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: '',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5]
        },
        {
          name: 'F',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5]
        },
        {
          name: '',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5]
        },
        {
          name: 'W',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5]
        },
        {
          name: '',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5]
        },
        {
          name: 'M',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5]
        },
        {
          name: '',
          data: [5, 10, 15, 20, 50, 0, 0, 0, 30, 5]
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