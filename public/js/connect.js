var socket = io.connect('http://192.168.0.16:8080');

socket.on('showSetting', function () {
	showSetting();
});

socket.on('gameStart', function (data) {
	createBoard(data);
});

socket.on('move', function (data) {
	move(data);
});

socket.on('rolling', function(data){
	rolling(data.d1, data.d2)
});

socket.on('showDice', function () {
	showDice();
});

socket.on('showTurnStatus', function (data) {
	showTurnStatus(data);
});

socket.on('appendChat', function (data) {
	appendChat(data);
});

socket.on('showMyGoldKey', function (data) {
	//console.log(data)
	showMyGoldKey(data);
});

socket.on('goldKey', function (data) {
	showGoldKey(data);
});

socket.on('removeGoldKey', function (data) {
	removeGoldKey(data);
});

socket.on('removeMyGoldKey', function (data) {
	removeMyGoldKey(data);
});
