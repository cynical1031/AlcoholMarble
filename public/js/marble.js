var intervalgetRoom;
var member = 0;
var myRoom = "";
var myId = "";
var myIdx = 0;
var memberList = []
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
			"릴렉스 타임(10분)",
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
			"업 다운",
			"다같이 음료수"
		];
var goldKeyOption = [
			"한잔 쉬기",
			"흑기사 지명권(거부X)",
			"내 잔 지목권",
			"음료수 1잔",
			"주류 제조권",
			"물 한잔"
		];
var imgMap = {
	"걸린 사람 원샷" : "1.jpg",
	"양 옆 마시기" : "2.jpg",
	"다같이 원샷" : "3.jpg",
	"나빼고 원샷" : "4.png",
	"007 빵" : "5.jpg",
	"눈치게임" : "6.png",
	"릴렉스 타임(10분)" : "7.png",
	"너 마셔" : "8.jpg",
	"흑기사" : "9.png",
	"랜덤게임" : "10.png",
	"3.6.9" : "11.png",
	"배스킨라빈스 31" : "12.jpg",
	"경마게임" : "13.png",
	"xx에 가면" : "14.png",
	"혼자왔습니다." : "15.jpg",
	"바보게임" : "16.png",
	"훈민정음" : "17.png",
	"더 게임 오브 데스" : "18.png",
	"공산당 게임" : "19.jpg",
	"바니바니" : "20.png",
	"손병호 게임" : "21.jpg",
	"구구단을 외자" : "22.png",
	"후라이팬 놀이" : "23.png",
	"딸기 게임" : "24.png",
	"할머니 게임" : "25.jpg",
	"아파트 게임" : "26.png",
	"다같이 물 한잔" : "27.png",
	"파도 타기" : "28.png",
	"세 잔 적립" : "29.png",
	"뚜껑 꺾기" : "30.png",
	"Happy New Year!" : "31.png",
	"업 다운" : "",
	"다같이 음료수" : ""
	
}
var player = [];
var memberArr = []
var doubleFlag = true;
var connectFlag = false;
var removed = []

function createRoom() {
	var roomName = $('#roomName').val();
	socket.emit('createRoom', roomName)
}

function getRoomList() {
	//socket.emit('lobby')
	socket.emit('roomList');
}

function roomList(rooms) {
	for (var room in rooms) {
		$('#roomList').html('<li class="lists" onclick="joinRoom($(this));"><div>' + rooms[room] + '</div></li>')
	}
}

function joinRoom(el) {
	clearInterval(intervalgetRoom)
	var roomName = el.children('div').text()
	socket.emit('joinRoom', roomName)
	socket.emit('sendMemberList', roomName)
}

function recieveMemberList(data) {
	member = data.memberList.length;
	memberList = data.memberList
	myIdx = data.idx;
	myId = data.memberList[data.idx]
}

function disconnected(data) {
	//	console.log(data.removed)
	//	removed.push(data.removed)
	var removeIndex = memberList.indexOf(data.removed);
	removed.push(removeIndex)
	$('#player' + removeIndex).hide()
	if (doubleFlag) {
		nextTurn++
		if (nextTurn < member) {
			socket.emit('showDice', {
				member: memberList[nextTurn],
				memberList: memberList
			});
		} else if (nextTurn == member) {
			socket.emit('showDice', {
				member: memberList[0],
				memberList: memberList
			});
			nextTurn = 0;
		}

	} else {
		socket.emit('showDice', {
			member: memberList[beforeTurn],
			memberList: memberList
		});
	}

	$('.logContent').eq(0).append('<p><span class="chat">Player' + removeIndex + '</span>님이 퇴장하였습니다.</p>')

}

function checkValue(value, arr) {
	var status = true;

	for (var i = 0; i < arr.length; i++) {
		var member = arr[i];
		if (member == value) {
			status = false;
			break;
		}
	}

	return status;
}

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
		myRoom: myRoom,
		gameRule: gameRule,
		memberList: memberList,
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
	$('#rollButton').hide()
	
	console.log('here?')
	var status = "";
	var d1 = Math.floor(Math.random() * 4 + 1); //random num 1-6
	var d2 = Math.floor(Math.random() * 4 + 1);
	var diceTotal = d1 + d2;
	socket.emit('rolling', {
		d1: d1,
		d2: d2
	});
	status += (" 숫자 : " + diceTotal + " ");
	if (d1 == d2) {
		status += ("더블");
		doubleFlag = false;
	}

	if (checkValue(memberList.indexOf(memberList[nextTurn]), removed)) {
		beforeTurn = nextTurn;
		var currentLoaction = Number($('#player' + beforeTurn + '').parent().attr('id'));
		var location = currentLoaction + diceTotal;
		if (doubleFlag) {
			nextTurn++;
			if (nextTurn == member) {
				nextTurn = 0;
			}
		} else {
			doubleFlag = true;
		}
		socket.emit('move', {
			playerId: beforeTurn,
			from: currentLoaction,
			to: location,
			diceNumber: diceTotal,
			nextTurn: nextTurn
		});
	} else {
		console.log('here??')
		nextTurn++;
		var currentLoaction = Number($('#player' + beforeTurn + '').parent().attr('id'));
		var location = currentLoaction + diceTotal;
		beforeTurn = nextTurn;
		
		if (doubleFlag) {
			nextTurn++;
			if (nextTurn >= member) {
				nextTurn = 0;
			}
		} else {
			nextTurn--;
			doubleFlag = true;
		}
		if(beforeTurn >= member)
		{
			beforeTurn = 0
		}
		console.log(beforeTurn)
		console.log(nextTurn)
		socket.emit('move', {
			playerId: beforeTurn,
			from: currentLoaction,
			to: location,
			diceNumber: diceTotal,
			nextTurn: nextTurn
		});
		
	}
	socket.emit('showTurnStatus', status);
}

function rolling(d1, d2) {
	var dice1 = $("#dice1");
	var dice2 = $("#dice2");
	dice1.attr("class", "dice"); //After clearing the last points animation
	dice1.css('cursor', 'default');
	dice1.animate({
		left: '+2px'
	}, 100, function () {
		dice1.addClass("dice_t");
	}).delay(200).animate({
		top: '-2px'
	}, 100, function () {
		dice1.removeClass("dice_t").addClass("dice_s");
	}).delay(200).animate({
		opacity: 'show'
	}, 600, function () {
		dice1.removeClass("dice_s").addClass("dice_e");
	}).delay(100).animate({
		left: '-2px',
		top: '2px'
	}, 100, function () {
		dice1.removeClass("dice_e").addClass("dice_" + d1);
		//$("#result").html("Your throwing points are<span>"+num+"</span>");
		dice1.css('cursor', 'pointer');
		$("#dice_mask").remove(); //remove mask
	});
	dice2.attr("class", "dice"); //After clearing the last points animation
	dice2.css('cursor', 'default');
	dice2.animate({
		left: '+2px'
	}, 100, function () {
		dice2.addClass("dice_t");
	}).delay(200).animate({
		top: '-2px'
	}, 100, function () {
		dice2.removeClass("dice_t").addClass("dice_s");
	}).delay(200).animate({
		opacity: 'show'
	}, 600, function () {
		dice2.removeClass("dice_s").addClass("dice_e");
	}).delay(100).animate({
		left: '-2px',
		top: '2px'
	}, 100, function () {
		dice2.removeClass("dice_e").addClass("dice_" + d2);
		//$("#result").html("Your throwing points are<span>"+num+"</span>");
		dice2.css('cursor', 'pointer');
		$("#dice_mask").remove(); //remove mask
	});
	return d1 + d2
}

function animateMovement(playerId, from, to, diceNumber) {
	console.log(playerId)

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
			remainingPixels = (to - 8) * 80;
		} else if (from < 20) {
			pixels = (19 - from) * 80;
			remainingPixels = (to - 20) * 80;
		} else if (from < 27) {
			pixels = (26 - from) * 80;
			remainingPixels = (to - 26) * 80;
		} else {
			pixels = (37 - from) * 80;
			remainingPixels = (to - 1) * 80;
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
	if (to == 5 || to == 16 || to == 25 || to == 33) {
		if (playerId == myIdx) {
			socket.emit('goldKey', memberList[playerId])
		}
	}
	else
	{
		if(to == 1)
		{
			socket.emit('myPenalty', '한 잔 마셔');
		}
		socket.emit('myPenalty', $('.' + to).text());
	}
}

function myPenalty(data) {
	$('#dialogWrap').show();
	$('#dialogContent').html(data);
	setTimeout(function(){
		$('#dialogWrap').hide(300);
	}, 2000)
}

function scrollMyMarker(playerId) {
	var el = document.getElementById('player' + playerId)
	el.scrollIntoView();
}

function removeGoldKey(playerId, text, idx) {
	var r = confirm("황금열쇠를 사용하시겠습니까?");
	if (r == true) {
		socket.emit('showMyGoldKey', {
			playerId: "Player" + playerId,
			text: text,
			memberId: memberList[playerId],
			eq: idx
		});
	}
}

function sendChat() {
	var content = $('#chatting').val()
	if (content != '') {
		socket.emit('appendChat', {
			myIdx: myIdx,
			content: content
		})
		$('#chatting').val('');
	}
}

function showInit(data) {
	$('#roomListWrap').hide()
	$('#tableWrap').show()
	myRoom = data;
}

function showSetting() {
	$('#settingWrap').show();
}

function welcome(data) {
	$('.logContent').eq(0).append('<p><span class="chat">Player' + data + ' 님이 입장하였습니다.</span></p>')
}

function createBoard(data) {

	var gameRule = data.data.gameRule;

	$('#dialogWrap').show();
	$('#dialogContent').html('게임을 시작합니다.<br />당신은 Player' + data.idx + '입니다.');
	$('.logContent').eq(0).append('게임을 시작합니다.<br />당신은 Player' + data.idx + '입니다.')
	setTimeout(function(){
		$('#dialogWrap').hide(300);
	}, 2000)
	for (var i = 0; i < gameRule.length; i++) {
		$('.game').eq(i).text(gameRule[i]);
		//console.log(imgMap[gameRule[i]])
		//$('.game').eq(i).css('background-image', 'linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(../images/cellBG/'+imgMap[gameRule[i]]+')')
	}
	for (var i = 0; i < member; i++) {
		player.push("" + i);
	}
	for (var i = 0; i < player.length; i++) {
		memberArr.push("<p id=player" + i + " style='position:relative; z-index:3'><img class='marker' style='width:40px;' src='./images/player1.png' /></p>")
		//float:left; ;
	}
	$('#1').prepend(memberArr);
	$('#settingWrap').hide();
	$('#diceWrap').show();
	$('#goldKeyStatus').show();
	$('#player0').addClass('blink');
	$('#rollButton').hide();
	socket.emit('showDice', {
		member: memberList[0],
		memberList: memberList
	});
}

function move(data) {
	//console.log(checkValue(data.data.playerId,removed))
	if (checkValue(memberList.indexOf(memberList[data.data.playerId]), removed))
	{
		var to = data.data.to;
		animateMovement(data.data.playerId, data.data.from, data.data.to, data.data.diceNumber);
		nextTurn = data.data.nextTurn;

		$('#rollButton').hide()
		setTimeout(function () {
			socket.emit('showDice', {
				member: memberList[nextTurn],
				memberList: memberList
			});
		}, 2000);
	}
//	if (to == 5 || to == 16 || to == 25 || to == 33) {
//		if (data.data.playerId == myIdx) {
//			socket.emit('goldKey', memberList[beforeTurn])
//		}
//		//goldKey();
//	}
}

function showDice() {
	$('#rollButton').show()
}

function blink(index) {
	$('p').removeClass('blink');
	$('#player' + index).addClass('blink');
}

function showTurnStatus(data) {
	setTimeout(function () {
		$('#turnStatus').html(data.data);
	}, 2000);
	$('.logContent').eq(1).append('<p>' + data.data + '</p>')
}

function appendChat(data) {
	$('.logContent').eq(0).append('<p><span class="chat">Player' + data.playerId + ' : </span>' + data.data + '</p>')
}

function openGoldKey(data) {
	var idx = memberList.indexOf(data)
	var randomCount = Math.floor(Math.random() * goldKeyOption.length);
	var goldKeySound = new Audio("./bgm/goldKey.wav");
	goldKeySound.play()
	$('#goldKeyContent').text(goldKeyOption[randomCount]);
	$('#goldKeyWrap').show(300);
	$('#statusList').append('<span class="goldKeyText" onclick="removeGoldKey(' + idx + ',$(this).text(),$(this).index());">' + goldKeyOption[randomCount] + '</span>');
	setTimeout(function(){
		$('#goldKeyWrap').hide(300)
		$('.card').removeClass('flipped');
	}, 2000)
}

function showMyGoldKey(data) {
	$('#dialogWrap').show();
	$('#dialogContent').html(data.playerId + '님이<br />' + data.text + '을(를) 사용합니다');
	setTimeout(function(){
		$('#dialogWrap').hide(300);
	}, 2000)
}

function removeMyGoldKey(eq) {
	$('.goldKeyText').eq(eq).remove()
}
