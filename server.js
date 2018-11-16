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
var settingFlag = true
var goldKeyOptin = 0
var availables = []
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'marble.html'));
});

io.sockets.on('connection', function (socket) {

	socket.on('lobby', function () {
		socket.leave(socket.room)
	});

	socket.on('createRoom', function (data) {
		//createRoom(data);
		if (availables.indexOf(data) == -1) {
			availables.push(data);
			socket.leave()
			socket.join(data)
			socket.room = data;
			socket.emit('showInit', data);
			socket.emit('showSetting');
		} else {
			socket.emit('existRoom');
		}

	});

	socket.on('roomList', function () {
		io.sockets.emit('roomList', availables);
	});

	socket.on('joinRoom', function (data) {
		console.log('here?')
		socket.join(data)
		socket.room = data;
		io.sockets.in(socket.room).emit('showInit', data)
	});

	socket.on('init', function (data) {
		var clients = io.sockets.adapter.rooms[data.myRoom].sockets;
		var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
		var memberList = []
		for (var clientId in clients) {
			var clientSocket = io.sockets.connected[clientId];
			memberList.push(clientId);
		}
		for (var i = 0; i < memberList.length; i++) {
			io.sockets.connected[memberList[i]].emit('gameStart', {
				memberList: memberList,
				idx: i,
				data: data
			});
		}
		var index = availables.indexOf(socket.room);
		availables.splice(index, 1);
	});

	socket.on('showDice', function (data) {
		//showDice(data);
		io.sockets.connected[data].emit('showDice');
	});

	socket.on('move', function (data) {
		move(socket.id, data);
	});

	socket.on('rolling', function (data) {
		rolling(data)
	});

	socket.on('scrollMyMarker', function (data) {
		scrollMyMarker(data)
	});

	socket.on('showTurnStatus', function (data) {
		showTurnStatus(data);
	});

	socket.on('appendChat', function (data) {
		//appendChat(data, socket.id, connections);
		console.log(data)
		io.sockets.to(socket.room).emit('appendChat', {
			data: data.content,
			playerId: data.myIdx
		});
	});

	socket.on('goldKey', function (data) {
		console.log(data)
		io.sockets.connected[data].emit('goldKey', data);
		//goldKey(playerId, socket.id, connections);
	});

	socket.on('showMyGoldKey', function (data) {
		console.log(data)
		io.sockets.to(socket.room).emit('showMyGoldKey', {
			playerId: data.playerId,
			text: data.text
		});
		//io.sockets.connected[memberId].emit('removeMyGoldKey', data.eq);
	});

	socket.on('closeConnection', function () {
		console.log('Client disconnects' + socket.id);
		socket.disconnect();
		removePlayer(socket.id);
	});

	socket.on('disconnect', function () {
		console.log('Got disconnected!' + socket.id);
		var index = availables.indexOf(socket.room);
		availables.splice(index, 1);
		socket.disconnect();
	});

});


function move(id, data) {
	console.log('moving');
	console.log(id);
	io.sockets.emit('move', {
		connection: connections,
		id: id,
		data: data
	});
}

function rolling(data) {
	io.sockets.emit('rolling', data);
}

function showDice(turn) {
	io.to(connections[turn]).emit('showDice');
}

function scrollMyMarker(data) {
	console.log(data);
	io.to(connections[data]).emit('scrollMyMarker', data);
}

function showTurnStatus(data) {

	io.sockets.emit('showTurnStatus', {
		data: data
	});
}

function goldKey(playerId, id, connections) {
	io.to(connections[playerId]).emit('goldKey', {
		playerId: playerId,
		id: id,
		connections: connections
	});
}

function removeMyGoldKey(playerId, eq, id, connections) {
	io.to(connections[playerId]).emit('removeMyGoldKey', {
		playerId: playerId,
		eq: eq,
		id: id,
		connections: connections
	});
}
