var member = 0;
var memberTurn = 0;
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
			"다같이 물 한잔"
		]
var goldKeyOption = [
			"한잔 쉬기",
			"흑기사 지명권(거부X)",
			"술 여행 선물권",
			"d",
			"e",
			"f",
			"g"
		];
var player = [];
var memberArr = []
var doubleFlag = true;


function init() {
	member = Number($('#playerCount').val());
	if ($('#gameRule').val() == "") {
		gameRule = []
	} else {
		gameRule = $('#gameRule').val().split('/');
	}

	if (gameRule.length < 26) {
		defaultRule = defaultRule.slice(0, (26 - gameRule.length))
		gameRule = shuffle(defaultRule.concat(gameRule))
	}

	for (var i = 0; i < gameRule.length; i++) {
		$('.game').eq(i).text(gameRule[i])
	}
	for (var i = 0; i < member; i++) {
		player.push("" + i);
	}
	for (var i = 0; i < player.length; i++) {
		memberArr.push("<p id=player" + i + " style='float:left; position:relative; z-index:3;'  data-journey='0'><img class='marker' style='width:40px;' src='./images/player1.png' /></p>")
	}

	$('#1').prepend(memberArr);
	$("p").draggable();
	$('#settingWrap').hide();
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
	var die1 = $("#die1");
	var die2 = $("#die2");
	var status = $("#status");
	var d1 = Math.floor(Math.random() * 4) + 1;
	var d2 = Math.floor(Math.random() * 4) + 1;
	var diceTotal = d1 + d2;
	die1.text(d1);
	die2.text(d2);
	status.text("나온 숫자 " + diceTotal + ".");
	if (d1 == d2) {
		status.append("더블 한번 더 ");
		doubleFlag = false;

	}
	var currentLoaction = Number($('#player' + memberTurn + '').parent().attr('id'))
	var location = currentLoaction + diceTotal
	animateMovement(memberTurn, currentLoaction, location, diceTotal);
	$('#player'+memberTurn-1).removeClass('blink')
	$('#player0').removeClass('blink')
	if (doubleFlag) {
		memberTurn++;
		if (memberTurn < member) {

			status.append(" 다음 턴 : " + player[memberTurn]);

		} else if (memberTurn == member) {
			status.append(" 다음 턴 : " + player[0]);
			$('#player0').addClass('blink')
			memberTurn = 0;
		}
	} else {
		doubleFlag = true;
	}

}

function animateMovement(playerId, from, to, diceNumber) {
	var journeyFlag = $('#player' + memberTurn + '').attr('data-journey')
	if (journeyFlag == 0) {
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
				pixels = (8 - from) * 85;
				remainingPixels = (to - 8) * 95;
			} else if (from < 21) {
				pixels = (20 - from) * 85;
				remainingPixels = (to - 20) *  95;
			} else if (from < 27) {
				pixels = (26 - from) * 85;
				remainingPixels = (to - 26) * 95;
			} else  {
				pixels = (37 - from) * 85;
				remainingPixels = (to - 1) * 95;
			}
			
			moveMarker(pixels, fromDirection, elem, toDirection, playerId, from, to, remainingPixels);
		}
	}
	else
	{
		journey(diceNumber)	
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
		goldKey();
	}
	if (to == 19) {
		$('#dialogWrap').show(300)
		$('#dialogContent').text('다음 턴 부터 술 여행 시작');
		$('.tile').find($('#player' + memberTurn + '')).remove();
		$('#28').append(memberArr[memberTurn])
		$('#player' + memberTurn + '').attr('data-journey', 1)
		$("p").draggable();
	}
	$('#player'+memberTurn).addClass('blink')
}

function goldKey() {
	var randomCount = Math.floor(Math.random() * goldKeyOption.length);
	$('#goldKeyContent').text(goldKeyOption[randomCount]);
	$('#goldKeyWrap').show(300);
}

function journey(diceNumber) {
	var currentLoaction = $('#player' + memberTurn + '').parent().attr('id')
	if (currentLoaction == 27) {
		currentLoaction = 0
	} else {
		currentLoaction = Number(currentLoaction.substr(7))
	}

	var location = currentLoaction + diceNumber;
	if (location > 10) {
		$('#dialogWrap').show(300)
		$('#dialogContent').text('술 여행 종료');
		$('.tile').find($('#player' + memberTurn + '')).remove();
		$('#13').append(memberArr[memberTurn])
		$('#player' + memberTurn + '').attr('data-journey', 0)
	} else {
		var des = $('#journey' + location + '').position();
		var el = ($('#player' + memberTurn + ''))
		el.css("position", "absolute");
		el.animate({
			top: des.top + "px",
			left: des.left + "px"
		}, function () {
			el.remove().appendTo('#journey' + location + '').css("position", "");
			el.remove().appendTo('#journey' + location + '').css("top", "");
			el.remove().appendTo('#journey' + location + '').css("left", "");
			$("p").draggable();
		})
	}

}

function drag() {
	$("p").draggable();
}
$(document).ready(function () {
	$('.card').click(function () {
		$(this).toggleClass('flipped');
	});
	$('#closeCard').click(function () {

		$('#goldKeyWrap').hide(300)
		$('.card').removeClass('flipped');
	})
	$('#closeDialog').click(function () {
		$('#dialogWrap').hide(300);
	})
})

