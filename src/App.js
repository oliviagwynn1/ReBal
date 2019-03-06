import React, { Component } from 'react';
import './App.css';
import Chart from './components/Chart';
import Line from './components/Line';
import axios from 'axios';

//https://api.particle.io/v1/devices?access_token=0312a8c10e2480a3d645e84eb9bd100ad90e42f9

class App extends Component {
	constructor() {
		super();
		this.state = {
			posts: [[]]
		}
		this.handleClick = this.handleClick.bind(this)
	}


	handleClick () {
		axios.get('https://my-json-server.typicode.com/oliviagwynn1/FakeJSONServer/posts')
			.then(res => this.setState({posts :
					res.data.map(x => x.vals).map(x => x.map(y=> Number(y)))
			}));
	}


	getChartData(){
		const posts = this.state.posts;
		return {
			labels: [
				'Left',
				'Right'
			],
			datasets:[
				{
					label: 'Weight',
					data: posts[posts.length-1].slice(1),
					backgroundColor: [
						'#0d47a1',
						'#f44336'
					]
				}]
		}
	}


	getLineData(){
		const posts = this.state.posts;
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