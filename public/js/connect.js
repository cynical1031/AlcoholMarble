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
socket.on('showDice',function(){
	showDice();
});
socket.on('showMyGoldKey', function(data){
	//console.log(data)
	showMyGoldKey(data);
})
socket.on('goldKey', function (data) {
	showGoldKey(data);
});

socket.on('removeGoldKey', function(data){
	removeGoldKey(data);
})

function showSetting(){
	$('#settingWrap').show();	
}

function createBoard(data) {
	
	member = data.connection.length;
	var gameRule = data.data.gameRule;

	console.log(gameRule);
	for (var i = 0; i < gameRule.length; i++) {
		$('.game').eq(i).text(gameRule[i]);
	}
	for (var i = 0; i < member; i++) {
		player.push("" + i);
	}
	for (var i = 0; i < player.length; i++) {
		memberArr.push("<p id=player" + i + " style='float:left; position:relative; z-index:3;'><img class='marker' style='width:40px;' src='./images/player1.png' /></p>")
	}
	$('#1').prepend(memberArr);
	$("p").draggable();
	$('#settingWrap').hide();
	$('#diceWrap').show();
	$('#goldKeyStatus').show();
	$('#goldKeyWrap').width(window.innerWidth);
	$('#goldKeyWrap').height(window.innerHeight);
	$('#dialogWrap').width(window.innerWidth);
	$('#dialogWrap').height(window.innerHeight);
	$('#diceWrap').hide();
	
	socket.emit('showDice',0);
}

function move(data) {
	//console.log(data.connection);
	//console.log(data.id+" id");
	var to = data.data.to;
	animateMovement(data.data.playerId, data.data.from, data.data.to, data.data.diceNumber);
	nextTurn = data.data.nextTurn;
	$('p').removeClass('blink');
	$('#player'+nextTurn).addClass('blink');
	setTimeout(function(){
		$('#diceWrap').hide()
		socket.emit('showDice',nextTurn);
	}, 2000);
	if (to == 5 || to == 16 || to == 25 || to == 33) {		
		socket.emit('goldKey',data.data.playerId)
		//goldKey();
	}
}

function showDice(){
	$('#diceWrap').show();	
}

function showGoldKey(data){
	if(data.id == data.connections[data.playerId])
	{
		goldKey(data.playerId);
	}
}

function goldKey(playerId){
	var randomCount = Math.floor(Math.random() * goldKeyOption.length);
	$('#goldKeyContent').text(goldKeyOption[randomCount]);
	$('#goldKeyWrap').show(300);
	$('#statusList').append('<span class="goldKeyText" onclick="removeGoldKey('+playerId+',$(this).text(),$(this).index());" style="padding-left:10px;">' + goldKeyOption[randomCount] + '</span>');
}

function showMyGoldKey(data){
	console.log(data)
	$('#dialogWrap').show();
	$('#dialogContent').html('Player'+data.data.playerId+ '님이<br />' + data.data.text + '을(를) 사용합니다');	
	if(data.id == data.connections[data.data.playerId])
	{
		$('.goldKeyText').eq(data.data.eq).remove();
	}
}

function removeGoldKey(data){
	console.log(data)
}