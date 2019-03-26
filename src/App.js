import React, { Component } from 'react';
import './App.css';
import Chart from './components/Chart';
import Line from './components/Line';
var config = require('./particle_logger/config.json');

//https://api.particle.io/v1/devices?access_token=0312a8c10e2480a3d645e84eb9bd100ad90e42f9

class App extends Component {
	constructor() {
		super();
		this.state = {
			posts: [[Date.now(), 0, 0]],
			earliestTime: 0
		};
		this.eventSource = new EventSource("https://api.particle.io/v1/devices/events?access_token="+config.access_token);
		this.eventSource.addEventListener("W", e =>
			this.updateWeightState(JSON.parse(e.data)));
	}

	// componentDidMount() {
	// 	this.eventSource.addEventListener("W", e =>
	// 		this.updateWeightState(JSON.parse(e.data)));
	// }

	parseData(weightState, time) {
		const weights = weightState.data.split(',').map(e => Number(e));
		return [time, weights[0], weights[1]];
	}

	updateWeightState(weightState) {
		const currTime = Date.parse(weightState.published_at);
		if (this.state.earliestTime === 0) {
			this.setState({earliestTime: currTime});
		}
		const timeDiff = currTime - this.state.earliestTime;
		if (timeDiff>60000) {
			this.setState(prevState => {
				const newposts = prevState.posts.concat([this.parseData(weightState, currTime)]);
				newposts.shift();
				return ({
					posts: newposts,
					earliestTime: prevState.posts[1][0]
				});
			});
		} else {
			this.setState(prevState => ({
				posts: prevState.posts.concat([this.parseData(weightState, currTime)])
			}));
		}
	}

	//
	// handleClick () {
	// 	axios.get('https://my-json-server.typicode.com/oliviagwynn1/FakeJSONServer/posts')
	// 		.then(res => this.setState({posts :
	// 				res.data.map(x => x.vals).map(x => x.map(y=> Number(y)))
	// 		}));
	// }


	// module.exports = function(CSVLogging, CSVName){
	// var es = new EventSource("https://api.particle.io/v1/devices/events?access_token="+config.access_token); // Listen to the stream
	// for (index in config.events){
	// 	es.addEventListener(config.events[index],function(message){ handleEvent(message, config.events[index], CSVLogging, CSVName)});
	// }
	// }

	getChartData(){
		const latest_posts = this.state.posts[this.state.posts.length-1];
		return {
			labels: [
				'Left',
				'Right'
			],
			datasets:[
				{
					label: 'Weight',
					data: [latest_posts[1], latest_posts[2]],
					backgroundColor: [
						'#0d47a1',
						'#f44336'
					]
				}]
		}
	}


	getLineData(){
		const basetime = this.state.earliestTime;
		const posts = this.state.posts.map(x => [Math.floor((x[0]-basetime)/1000), x[1], x[2]]);
		return {
			type: "line",
			labels: posts.map(a => a[0]),
			datasets: [
				{
					label: 'Left',
					data: posts.map(a => ({
						x:a[0],
						y:a[1]
					})),
					backgroundColor:'transparent',
					borderColor:'#0d47a1'
				},
				{
					label: 'Right',
					data: posts.map(a => ({
						x:a[0],
						y:a[2]
					})),
					backgroundColor:'transparent',
					borderColor:'#f44336'
				},
				{
					label: 'Total',
					data: posts.map(a => ({
						x:a[0],
						y:a[1]+a[2]
					})),
					backgroundColor:'transparent',
					borderColor:'#008b02'
				}
				]
		};
	}

	render() {
		return (
		<div className="App" align="center">
			<div className="App-header">
				<h1>
					ReBal
				</h1>
				<button className='button' onClick={this.handleClick}>
					Weight Data
				</button>
			</div>
			<Chart chartData={this.getChartData()}/>
			<Line lineData={this.getLineData()}/>
		</div>
		);
	}
}
 
export default App;