/*
 * handle-device.js
 * This module handles listening to the particle device stream and saving received data
 * in real time to the database (LogEvent models). It also has capability to send push
 * notifications to clients using socketio when new packages arrive.
 * @author: Suyash Kumar <suyashkumar2003@gmail.com>
 */
var EventSource = require('eventsource'); // Pull in event source
var LogEvent = require('./LogEvent.js');
var config = require('./config.json');
var fs = require('fs');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


module.exports = function(){
	var es = new EventSource("https://api.particle.io/v1/devices/events?access_token="+config.access_token); // Listen to the stream
	for (index in config.events){
		es.addEventListener(config.events[index],function(message){ handleEvent(message, config.events[index])});
	}
}

function handleEvent (message, eventData, Adding) {
	console.log("New Message");
	realData = JSON.parse(message.data);
	console.log(realData);
	realData.data = eventData;
	if (!Adding){	// currently you can only CSV log when not logging to mongodb
		addRecord(realData);
	} else{
		updateArray(realData);
	}
	// io.on('connection', function(socket){
	// 	io.emit('broadcast', realData);
	// });
}

function addRecord(data){
	var toAdd= {
		coreid:			data.coreid,
		published_at:	new Date(data.published_at),
		data:			data.data,
		name:			data.name
	},
	console.log(toAdd);
	var newRecord = new LogEvent(toAdd);
	newRecord.save(function(err){
		if(err) console.log("error in saving to database"+err);
	})
	// io.emit(data.probeid,newRecord);
}
function updateArray(data){
	var appendStr = '' + data.name + ', ' + data.coreid + ', ' + data.published_at + ', ' + data.data +"\n";
	fs.appendFile(appendStr, function(err){
		if(err) throw err;
	});
	console.log('Logged');
}