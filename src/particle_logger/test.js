var io = require('socket.io-client');

var socket = io.connect('http://localhost');
console.log("here");
while(true) {
    socket.on('event', function (data) {
        console.log("try");
        console.log(data);
    });
}
console.log("done");