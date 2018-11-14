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
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'marble.html'));
});

io.sockets.on('connection', function (socket) {
	
	var roomList = []
	if (settingFlag) {

	}

	connections.push(socket.id);
	//console.log(connections);
	socket.on('lobby', function(){
		socket.leave(socket.id)
	});
	
	socket.on('createRoom', function (data) {
		//createRoom(data);
		roomList.push(data);
		socket.leave()
		socket.join(data)
		socket.room = data;

		io.sockets.in(socket.room).emit('showInit');
		io.to(connections[0]).emit('showSetting');
	});
	socket.on('joinRoom', function(data){
		console.log('here?')
		socket.join(data)
		socket.room = data;
		io.sockets.in(socket.room).emit('showInit')
	})
	socket.on('roomList', function () {
		console.log('here?')
		var availables = []
		var rooms = io.sockets.adapter.rooms;
		if (rooms) {
			for (var room in rooms) {
				if(!rooms[room].hasOwnProperty(room)){
					availables.push(room)
				}
			}
		}
		console.log(availables)
		sendRoomList(availables)
	})

	socket.on('init', function (data) {
		startGame(data);
		goldKeyOption = data.goldKeyOption
		console.log(goldKeyOption)
		settingFlag = false;
	});

	socket.on('move', function (data) {
		move(socket.id, data);
	});

	socket.on('rolling', function (data) {
		rolling(data)
	});

	socket.on('showDice', function (data) {
		showDice(data);
	});

	socket.on('scrollMyMarker', function (data) {
		scrollMyMarker(data)
	});

	socket.on('showTurnStatus', function (data) {
		showTurnStatus(data);
	});

	socket.on('appendChat', function (data) {
		appendChat(data, socket.id, connections);
	});

	socket.on('goldKey', function (playerId) {
		goldKey(playerId, socket.id, connections);
	});

	socket.on('closeConnection', function () {
		console.log('Client disconnects' + socket.id);
		socket.disconnect();
		removePlayer(socket.id);
	});

	socket.on('showMyGoldKey', function (data) {
		showMyGoldKey(data, socket.id, connections);
		removeMyGoldKey(data.playerId, data.eq, socket.id, connections)
	});

	socket.on('disconnect', function () {
		console.log('Got disconnected!' + socket.id);
		socket.disconnect();
		removePlayer(socket.id);
	});

});

function createRoom(data) {
	console.log(data)
}
function sendRoomList(rooms){
	io.sockets.emit('roomList', rooms);
}
function removePlayer(item) {
	var index = connections.indexOf(item);
	connections.splice(index, 1);
	if (connections.length == 0) {
		settingFlag = true
	}
}

function startGame(data) {
	console.log('Starting game');
	for (var i = 0; i < connections.length; i++) {
		var playerId = i + 1;
		io.to(connections[i]).emit('gameStart', {
			connection: connections,
			idx: i,
			data: data
		});
	}
}

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

function appendChat(data, id, connections) {
	var index = connections.indexOf(id);
	console.log(data)
	io.sockets.emit('appendChat', {
		data: data,
		playerId: index
	});
}

function goldKey(playerId, id, connections) {
	io.to(connections[playerId]).emit('goldKey', {
		playerId: playerId,
		id: id,
		connections: connections
	});
}

function showMyGoldKey(data, id, connections) {
	io.sockets.emit('showMyGoldKey', {
		connections: connections,
		id: id,
		data: data
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
