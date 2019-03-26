import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';


class LineGraph extends Component {
    constructor(props){
        super(props);
    }

  render(){
      return (
          <div className="chart">
              <Line
                  height={300}
                  data={this.props.lineData}
                  options={{
                      title:{
                          display:true,
                          text:'Line Graph',
                          fontSize:25,
                          fontColor:'white',
                          fontFamily:'Charter'
                      },
                      legend:{
                          display:true,
                      },
                      maintainAspectRatio:false,
                      scales: {
                          yAxes: [{
                              ticks: {
                                  beginAtZero: true
                              }
                          }],
                          xAxes: [{
                              ticks: {
                                  beginAtZero: true,
                                  autoSkip: false
                              }
                          }]
                      }
                  }}
              />
          </div>
      )
  }
}

export default LineGraph;
