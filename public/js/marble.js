var member = 0;
var nextTurn = 0;
var beforeTurn = 0;
var gameRule = [];
var defaultRule = [
			"걸린 사람 원샷",
			"양 옆 마시기",
			"다같이 원샷",
			"나빼고 원샷",
			"007 빵",
			"눈치게임",
			"한 번 쉬기",
			"너 마셔",
			"흑기사",
			"랜덤게임",
			"3.6.9",
			"배스킨라빈스 31",
			"경마게임",
			"xx에 가면",
			"혼자왔습니다.",
			"바보게임",
			"훈민정음",
			"더 게임 오브 데스",
			"공산당 게임",
			"바니바니",
			"더 게임 오브 데쓰",
			"손병호 게임",
			"구구단을 외자",
			"후라이팬 놀이",
			"딸기 게임",
			"할머니 게임",
			"아파트 게임",
			"다같이 물 한잔",
			"파도 타기",
			"세 잔 적립",
			"뚜껑 꺾기",
			"Happy New Year!",
			"업 다운"
		];
var goldKeyOption = [
			"한잔 쉬기",
			"흑기사 지명권(거부X)",
			"내 잔 지목권",
			"음료수 1잔",
			"주류 제조권",
			"물 한잔"
		];
var player = [];
var memberArr = []
var doubleFlag = true;

function init() {
	if ($('#gameRule').val() == "") {
		gameRule = [];
	} else {
		gameRule = $('#gameRule').val().split('/');
	}

	if (gameRule.length < 31) {
		defaultRule = defaultRule.slice(0, (31 - gameRule.length));
		gameRule = shuffle(defaultRule.concat(gameRule));
	}

	socket.emit('init', {
		gameRule: gameRule,
		goldKeyOption: goldKeyOption.length
	});
}

function shuffle(arr) {
	for (var i = arr.length - 1; i > 0; i--) {
		var randomIndex = Math.floor(Math.random() * (i + 1));
		var shuffled = arr[i];
		arr[i] = arr[randomIndex];
		arr[randomIndex] = shuffled;
	}
	return arr;
}

function rollDice() {
	var dice1 = $("#dice1");
	var dice2 = $("#dice2");
	var d1 = Math.floor(Math.random()*4+1);//random num 1-6
	var d2 = Math.floor(Math.random()*4+1);
	dice1.attr("class","dice");//After clearing the last points animation
	dice1.css('cursor','default');	
	dice1.animate({left: '+2px'}, 100,function(){
		dice1.addClass("dice_t");
	}).delay(200).animate({top:'-2px'},100,function(){
		dice1.removeClass("dice_t").addClass("dice_s");
	}).delay(200).animate({opacity: 'show'},600,function(){
		dice1.removeClass("dice_s").addClass("dice_e");
	}).delay(100).animate({left:'-2px',top:'2px'},100,function(){
		dice1.removeClass("dice_e").addClass("dice_"+d1);
		//$("#result").html("Your throwing points are<span>"+num+"</span>");
		dice1.css('cursor','pointer');
		$("#dice_mask").remove();//remove mask
	});
	dice2.attr("class","dice");//After clearing the last points animation
	dice2.css('cursor','default');	
	dice2.animate({left: '+2px'}, 100,function(){
		dice2.addClass("dice_t");
	}).delay(200).animate({top:'-2px'},100,function(){
		dice2.removeClass("dice_t").addClass("dice_s");
	}).delay(200).animate({opacity: 'show'},600,function(){
		dice2.removeClass("dice_s").addClass("dice_e");
	}).delay(100).animate({left:'-2px',top:'2px'},100,function(){
		dice2.removeClass("dice_e").addClass("dice_"+d2);
		//$("#result").html("Your throwing points are<span>"+num+"</span>");
		dice2.css('cursor','pointer');
		$("#dice_mask").remove();//remove mask
	});

	var status = "";
	var diceTotal = d1 + d2;
	status += "player"+nextTurn;
	status += (" 숫자 : " + diceTotal + ", ");
	if (d1 == d2) {
		status += ("더블");
		doubleFlag = false;
	}
	console.log(diceTotal)
	beforeTurn = nextTurn;
	var currentLoaction = Number($('#player' + beforeTurn + '').parent().attr('id'));
	var location = currentLoaction + diceTotal;
	if (doubleFlag) {
		nextTurn++;
		if (nextTurn < member) {
			status += (" 다음 턴 : Player" + player[nextTurn]);
		} else if (nextTurn == member) {
			status += (" 다음 턴 : Player" + player[0]);
			nextTurn = 0;
		}
	} else {
		doubleFlag = true;
	}
	//console.log(status)
	socket.emit('move', {
		playerId: beforeTurn,
		from: currentLoaction,
		to: location,
		diceNumber: diceTotal,
		nextTurn: nextTurn
	});
	socket.emit('showTurnStatus', status);

}

function animateMovement(playerId, from, to, diceNumber) {
	var elem = document.getElementById("player" + playerId);
	if (to > 36) {
		to = to - 36
	}
	var fromDirection = getDirection(from);
	var toDirection = getDirection(to);


	elem.className = '';

	if (fromDirection == toDirection) {
		pixels = diceNumber * 80;
		elem.classList.add("player" + playerId + "_" + fromDirection);
		calculateMove(pixels, fromDirection, elem, toDirection, playerId, from, to);
	} else {
		elem.classList.add("player" + playerId + "_" + fromDirection);
		if (from < 9) {
			pixels = (8 - from) * $('#1').width();
			remainingPixels = (to - 8) * $('#1').width();
		} else if (from < 21) {
			pixels = (20 - from) * 85;
			remainingPixels = (to - 20) * $('#1').width();
		} else if (from < 27) {
			pixels = (26 - from) * 85;
			remainingPixels = (to - 26) * $('#1').width();
		} else {
			pixels = (37 - from) * 85;
			remainingPixels = (to - 1) * $('#1').width();
		}

		moveMarker(pixels, fromDirection, elem, toDirection, playerId, from, to, remainingPixels);
	}

}

function getDirection(pos) {
	if (pos >= 1 && pos < 9) {
		return "up";
	} else if (pos >= 9 && pos < 20) {
		return "left";
	} else if (pos >= 20 && pos < 27) {
		return "down";
	} else {
		return "right";
	}
}

function calculateMove(pixels, direction, elem, toDirection, playerId, from, to) {
	var pos = 0;
	elem.classList.add("animation");
	var id = setInterval(frame, 1);

	function frame() {
		if (pos == pixels || pos == -pixels) {
			clearInterval(id);
			elem.className = '';
			elem.style.bottom = '0px';
			elem.style.left = '0px';
			elem.style.top = '0px';
			elem.style.right = '0px';
			elem.classList.add("player" + playerId + "_" + toDirection);
			attatch(playerId, from, to);
		} else {

			if (direction == "right" || direction == "up") {
				pos--;
			} else {
				pos++;
			}

			switch (direction) {
				case "up":
					elem.style.top = pos + 'px';
					break;
				case "left":
					elem.style.left = pos + 'px';
					break;
				case "down":
					elem.style.top = pos + 'px';
					break;
				case "right":
					elem.style.left = pos + 'px';
					break;
				default:
					break;

			}
		}
	}
}


function moveMarker(pixels, direction, elem, toDirection, playerId, from, to, remainingPixels) {
	var pos = 0;
	elem.classList.add("animation");
	var id = setInterval(frame, 1);

	function frame() {
		if (pos == pixels || pos == -pixels) {
			clearInterval(id);
			elem.className = '';

			elem.classList.add("player" + playerId + "_" + toDirection);
			calculateMove(remainingPixels, toDirection, elem, toDirection, playerId, from, to);
		} else {
			if (direction == "right" || direction == "up") {
				pos--;
			} else {
				pos++;
			}

			switch (direction) {
				case "up":
					elem.style.top = pos + 'px';
					break;
				case "left":
					elem.style.left = pos + 'px';
					break;
				case "down":
					elem.style.top = pos + 'px';
					break;
				case "right":
					elem.style.left = pos + 'px';
					break;
				default:
					break;
			}
		}
	}
}

function attatch(playerId, from, to) {
	document.getElementById(to).appendChild(document.getElementById('player' + playerId));
	$('#diceWrap ul li').eq(1).show()
}

function removeGoldKey(playerId, text, idx) {
	console.log(playerId)
	console.log(text)
	console.log(idx)
	socket.emit('showMyGoldKey', {
		playerId: playerId,
		text: text,
		eq: idx
	})
}

function drag() {
	$("p").draggable();
}
function sendChat(){
	var content = $('#chatting').val()
	if(content != '')
	{
		socket.emit('appendChat', content)
		$('#chatting').val('');
	}
}
function showSetting() {
	$('#settingWrap').show();
}

function createBoard(data) {

	member = data.connection.length;
	var gameRule = data.data.gameRule;

	//console.log(gameRule);
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
//	$('#goldKeyWrap').width(window.innerWidth);
//	$('#goldKeyWrap').height(window.innerHeight);
//	$('#dialogWrap').width(window.innerWidth);
//	$('#dialogWrap').height(window.innerHeight);
	$('#diceWrap').hide();

	socket.emit('showDice', 0);
}

function move(data) {
	//console.log(data.connection);
	//console.log(data.id+" id");
	var to = data.data.to;
	animateMovement(data.data.playerId, data.data.from, data.data.to, data.data.diceNumber);
	nextTurn = data.data.nextTurn;
	$('p').removeClass('blink');
	$('#player' + nextTurn).addClass('blink');
	$('#diceWrap ul li').eq(1).hide()
	setTimeout(function () {
		$('#diceWrap').hide()
		socket.emit('showDice', nextTurn);
	}, 2000);
	if (to == 5 || to == 16 || to == 25 || to == 33) {
		socket.emit('goldKey', data.data.playerId)
		//goldKey();
	}
}

function showDice() {
	$('#diceWrap').show();
}

function showTurnStatus(data){
	$('.logContent').eq(1).append('<p>'+data.data+'</p>')
}

function appendChat(data)
{
	console.log(data)
	$('.logContent').eq(0).append('<p><span class="chat">Player'+data.playerId+' : </span>'+data.data+'</p>')
}

function showGoldKey(data) {
	if (data.id == data.connections[data.playerId]) {
		goldKey(data.playerId);
	}
}

function goldKey(playerId) {
	var randomCount = Math.floor(Math.random() * goldKeyOption.length);
	$('#goldKeyContent').text(goldKeyOption[randomCount]);
	$('#goldKeyWrap').show(300);
	$('#statusList').append('<span class="goldKeyText" onclick="removeGoldKey(' + playerId + ',$(this).text(),$(this).index());" style="padding-left:10px; cursor:pointer;">' + goldKeyOption[randomCount] + '</span>');
}

function showMyGoldKey(data) {
	console.log(data)
	$('#dialogWrap').show();
	$('#dialogContent').html('Player' + data.data.playerId + '님이<br />' + data.data.text + '을(를) 사용합니다');
}

function removeMyGoldKey(data) {
	console.log(data)
	$('.goldKeyText').eq(data.eq).remove()
}
