var socket = io.connect('http://192.168.0.16:8080');

socket.on('gameStart', function (data) {
	createBoard(data);
});
socket.on('move', function (data) {
	move(data);
});

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
		$('#statusList').append("<li class='statusLi'>player" + i + "</li>")
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
}

function move(data) {
	console.log(data.data.playerId);
	animateMovement(data.data.playerId, data.data.from, data.data.to, data.data.diceNumber);
	nextTurn = data.data.nextTurn;
	$('p').removeClass('blink');
	$('#player'+nextTurn).addClass('blink');
}

function goldKey(){
	
}