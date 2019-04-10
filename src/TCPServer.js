var net = require("net");

var server  = net.createServer();

server.on("connection", function (socket) { // socket maintains same connections until is has been closed
    var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
    console.log("new client connection is made %s", remoteAddress);

    socket.on("data", function (d) {
        console.log("Data data from %s: %s", remoteAddress, d);
        socket.write("Hello" + d);
    });

    socket.once("close", function () {
        console.log("Connection from %s closed", remoteAddress);
    });


    socket.on("error", function (err) {
        console.log("Connection %s error: %s", remoteAddress, err.message);
    });

});

server.listen(9000, function () {
    console.log("server listening to %j" + server.address());
});
