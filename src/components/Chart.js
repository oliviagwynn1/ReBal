import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';

class Chart extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
              <div className="chart">
                  <Bar
                      height={250}
                      data={this.props.chartData}
                      options={{
                          title:{
                              display:true,
                              text:'Bar Graph',
                              fontSize:25,
                              fontColor:'white',
                              fontFamily:'Charter'
                          },
                          legend:{
                              display:false
                          },
                          scales:{
                              yAxes:[{
                                  ticks: {
                                      beginAtZero: true,
                                      suggestedMax: 100
                                  }
                              }],
                          },
                          maintainAspectRatio: false
                      }}
                  />
              </div>
      )
  }
}

export default Chart;