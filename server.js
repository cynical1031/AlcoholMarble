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
	
	socket.on('init', function (data) {
		startGame(data);
	});
	socket.on('move', function (data) {
		move(data);
	});
	
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

function removePlayer(item) {
	var index = connections.indexOf(item);
	connections.splice(index, 1);
}

function startGame(data) {
	console.log('Starting game');

	for (var i = 0; i < connections.length; i++) {
		var playerId = i + 1;
		io.to(connections[i]).emit('gameStart', {
			connection: connections,
			data: data
		});
	}
}

function move(data) {
	console.log('moving');
	io.sockets.emit('move', {
		data
	});
}
