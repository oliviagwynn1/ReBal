import React, { Component } from 'react';
import './App.css';
import Chart from './components/Chart';
import socketIOClient from 'socket.io-client';
import Line from "./components/Line";
var socket;

class App extends Component {
	constructor() {
		super();
		this.state = {
			posts: [{date: Date.now(), left: 0, right: 0, total: 0}],
			earliestTime: 0,
			isRecording: 0,
			isToggleOn: true
		 };
		socket = socketIOClient("http://localhost:8000");

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState(state => ({
			isToggleOn: !state.isToggleOn
		}));
		if (this.state.isToggleOn === true) {
			socket.on('data', data => this.updateWeightState(data.data));
		}
		else {
			socket.off();
		}
	}

	parseData(weightState, time) {
		const weights = weightState.split(',').map(e => Number(e));
		return [time, weights[0], weights[1]];
	}

	updateWeightState(weightState) {
		const currTime = Date.now();
		if (this.state.earliestTime === 0) {
			this.setState({earliestTime: currTime});
		}
		const timeDiff = currTime - this.state.earliestTime;
		if (timeDiff>5000) {
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
		const posts = this.state.posts.map(x => [Math.floor((x[0]-basetime)/5), x[1], x[2]]);
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
					{this.state.isToggleOn ? 'Get Data' : 'Stop Data'}
				</button>
			</div>
			<Chart chartData={this.getChartData()}/>
			<Line lineData={this.getLineData()}/>
		</div>
		);
	}
}

export default App;