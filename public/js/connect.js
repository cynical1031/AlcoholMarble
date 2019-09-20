var socket = io.connect('http://192.168.0.18:8080');

socket.on('existRoom', function () {
	alert('이미 방이 존재합니다.')
});

socket.on('startingRoom', function () {
	alert('게임이 시작되어 입장이 불가능합니다.');

});

socket.on('roomList', function (rooms) {
	roomList(rooms)
});

socket.on('welcome', function (data) {
	welcome(data);
});

socket.on('sendMemberList', function (data) {
	recieveMemberList(data)
});

socket.on('showInit', function (data) {
	showInit(data);
});

socket.on('showSetting', function () {
	showSetting();
});

socket.on('gameStart', function (data) {
	createBoard(data);
});

socket.on('move', function (data) {
	move(data);
});

socket.on('myPenalty', function (data) {
	myPenalty(data);
})

socket.on('rolling', function (data) {
	rolling(data.d1, data.d2)
});

socket.on('showDice', function () {
	showDice();
});

socket.on('scrollMyMarker', function (data) {
	scrollMyMarker(data)
})

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
	openGoldKey(data);
});

socket.on('removeGoldKey', function (data) {
	removeGoldKey(data);
});

socket.on('removeMyGoldKey', function (data) {
	removeMyGoldKey(data);
});

socket.on('disconnected', function(data){
	disconnected(data);
});

socket.on('blink', function(index){
	blink(index);
});