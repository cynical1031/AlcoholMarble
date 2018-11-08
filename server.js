//const express = require('express');
//const path = require('path');
//const app = express();
//
//app.use(express.static(path.join(__dirname, 'public')));
//
//app.get('/', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'marble.html'));
//});
//
//app.listen(8080, () => {
//  console.log('Express App on port 8080!');
//});
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var httpServer = http.createServer(app).listen(8080, function (req, res) {

	console.log('Socket IO server has been started');

});
var io = require('socket.io').listen(httpServer);

var connections = [];
var numberOfConnections = 2;

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'marble.html'));
});


io.sockets.on('connection', function (socket) {
	connections.push(socket.id);
	console.log(connections);

	socket.on('closeConnection', function () {
		console.log('Client disconnects' + socket.id);
		socket.disconnect();
		removePlayer(socket.id);
	});

	socket.on('disconnect', function () {
		console.log('Got disconnected!' + socket.id);
		socket.disconnect();
		removePlayer(socket.id);
	});
});
function removePlayer(item)
{
	var index = connections.indexOf(item);
	connections.splice(index, 1);
}