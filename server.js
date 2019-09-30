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
var settingFlag = true;
var goldKeyOptin = 0;
var availables = []
var roomList = {};
var removed = []
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'lobby.html'));
});
app.get('/room/:roomNumber', (req, res) => {
	console.log(req.params.roomNumber)
});
io.sockets.on('connection', function (socket) {

	socket.leave(socket.id)
	connections.push(socket.id)
	socket.on('createRoom', function (data) {
		//createRoom(data);
		if (availables.indexOf(data) == -1) {
			availables.push(data);
			socket.leave()
			socket.join(data)
			socket.room = data;
			roomList[data] = true;
			socket.emit('showInit', data);
			socket.emit('showSetting');
			var memberList = []
			memberList.push(socket.id);
			io.sockets.connected[memberList[0]].emit('sendMemberList', {
				memberList: memberList,
				idx: 0,
			});
		} else {
			socket.emit('existRoom');
		}
	});

	socket.on('roomList', function () {
		io.sockets.emit('roomList', Object.keys(roomList));
	});

	socket.on('joinRoom', function (data) {
		if (roomList[data]) {
			socket.join(data)
			socket.room = data;
			io.sockets.in(socket.room).emit('showInit', data)
			var clients = io.sockets.adapter.rooms[data].sockets;
			var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
			var memberList = []
			for (var clientId in clients) {
				var clientSocket = io.sockets.connected[clientId];
				memberList.push(clientId);
			}

			for (var i = 0; i < memberList.length; i++) {
				io.sockets.connected[memberList[i]].emit('sendMemberList', {
					memberList: memberList,
					idx: i,
				});
			}
			var myIndex = memberList.indexOf(socket.id)
			io.sockets.to(socket.room).emit('welcome', myIndex)
		} else {
			socket.emit('startingRoom')
		}
	});

	socket.on('init', function (data) {
		console.log(data)
		roomList[data.myRoom]
		for (var i = 0; i < data.memberList.length; i++) {
			io.sockets.connected[data.memberList[i]].emit('gameStart', {
				idx: i,
				data: data
			});
		}
		roomList[socket.room] = false;
	});

	socket.on('showDice', function (data) {
//		var index = data.memberList.indexOf(data.member)
//		var id = data.memberList[(index+1)]
//		if(data.memberList.indexOf(data.member) != -1)
//		{
//			
//		}
		var index = data.memberList.indexOf(data.member);
		
		if(checkValue(data.member, removed))
		{
			io.sockets.connected[data.member].emit('showDice');
		}
		else
		{
			index++;
			console.log(index)
			console.log(data.memberList.length)			
			if (index == data.memberList.length) {
				index = 0;
			}
			io.sockets.connected[data.memberList[index]].emit('showDice');
		}
		
		io.sockets.in(socket.room).emit('blink', index);
	});

	socket.on('move', function (data) {
		console.log(data)
		io.sockets.in(socket.room).emit('move', {
			data: data
		});
	});
	
	socket.on('myPenalty', function (data) {
		io.sockets.to(socket.room).emit('myPenalty', data);
	});
	
	socket.on('rolling', function (data) {
		io.sockets.in(socket.room).emit('rolling', data);
	});

	//	socket.on('scrollMyMarker', function (data) {
	//		scrollMyMarker(data)
	//		io.to(connections[data]).emit('scrollMyMarker', data);
	//	});

	socket.on('showTurnStatus', function (data) {
		io.sockets.in(socket.room).emit('showTurnStatus', {
			data: data
		});
	});

	socket.on('appendChat', function (data) {
		io.sockets.to(socket.room).emit('appendChat', {
			data: data.content,
			playerId: data.myIdx
		});
	});

	socket.on('goldKey', function (data) {
		console.log(data)
		io.sockets.connected[data].emit('goldKey', data);
	});

	socket.on('showMyGoldKey', function (data) {
		io.sockets.to(socket.room).emit('showMyGoldKey', {
			playerId: data.playerId,
			text: data.text
		});
		io.sockets.connected[data.memberId].emit('removeMyGoldKey', data.eq);
	});

	socket.on('closeConnection', function () {
		console.log('Client disconnects' + socket.id);
		//socket.disconnect();
		removePlayer(socket.id);
	});

	socket.on('disconnect', function () {
		console.log('Got disconnected!' + socket.id);

		var data = socket.room
		var socket_id = socket.id
		removed.push(socket_id)
		io.in(data).clients(function (error, clients) {
			if (clients.length == 0) {
				delete roomList[data]
				var index = availables.indexOf(data);
				availables.splice(index, 1);
			} else if(data != undefined){
				var clients = io.sockets.adapter.rooms[data].sockets;
				var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
				var memberList = []
				for (var clientId in clients) {
					var clientSocket = io.sockets.connected[clientId];
					memberList.push(clientId);
				}
				console.log(memberList)
				for (var i = 0; i < memberList.length; i++) {
					io.sockets.connected[memberList[i]].emit('disconnected', {
						removed: socket.id,
						memberList: memberList,
						idx: i,
					});
				}
			}
		});
		console.log(roomList)
	});

});

function checkValue(value,arr){
  var status = true;
 
  for(var i=0; i<arr.length; i++){
    var member = arr[i];
    if(member == value){
      status = false;
      break;
    }
  }

  return status;
}
