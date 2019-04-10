const PORT = 30000;
const HOST = '10.194.29.178';
const SEND_PORT = 8000;

const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const express = require('express');
const sendserver = require('http').createServer(express());
const io = require('socket.io')(sendserver);
var ab2str = require('arraybuffer-to-string');

io.on('connection', (_) => {console.log("something connected")});

server.on('listening', function () {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    io.emit('data', {data: ab2str(message)});
    console.log(remote.address + ':' + remote.port +' - ' + message);

});

sendserver.listen(SEND_PORT);
server.bind(PORT, HOST);