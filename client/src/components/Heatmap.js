import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Heatmap extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: '',
          data: [5, 10, 15, 20, 50, 30, 10, 70, 30, 5, 50, 20,40, 10]
        },
        {
          name: 'F',
          data: [5, 10, 15, 20, 50, 15, 20, 50, 30, 5, 50, 20,40, 10]
        },
        {
          name: '',
          data: [5, 10, 15, 20, 50, 0, 0, 15, 20, 50, 50, 20,40, 10]
        },
        {
          name: 'W',
          data: [15, 20, 50, 20, 50, 0, 0, 0, 30, 5, 50, 20,40, 10]
        },
        {
          name: '',
          data: [5, 30, 5, 20, 50, 30, 5, 0, 30, 5, 50, 20,40, 10]
        },
        {
          name: 'M',
          data: [5, 10, 15, 20, 30, 5, 0, 0, 30, 5, 50, 20,40, 10]
        },
        {
          name: '',
          data: [5, 10, 15, 30, 5, 0, 0, 0, 30, 5, 50, 20,40, 10]
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
          colors: ["#8C90AA"],
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