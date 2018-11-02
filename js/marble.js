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
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g"
		];
		var player = [];
		var memberArr = []
		var doubleFlag = true;
		var journeyFlag = true;
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
				memberArr.push("<p class=player" + i + " style='float:left;'><img class='marker' style='width:40px;' src='./images/player1.png' /></p>")
			}

			$('#0').prepend(memberArr);
			$("p").draggable();
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
			moveMarker(diceTotal);

			if (doubleFlag) {
				memberTurn++;
				if (memberTurn < member) {

					status.append(" 다음 턴 : " + player[memberTurn]);
				} else if (memberTurn == member) {
					status.append(" 다음 턴 : " + player[0]);
					memberTurn = 0;
				}
			} else {
				doubleFlag = true;
			}

		}

		function moveMarker(diceTotal) {

			var currentLoaction = Number($('.player' + memberTurn + '').parent().attr('id'))
			//alert($('.player' + memberTurn + '').parent().attr('id'))

			var location = currentLoaction + diceTotal;
			console.log('memberTurn : ' + memberTurn);
			console.log('diceTotal : ' + diceTotal);
			console.log('last : ' + currentLoaction);
			console.log('location : ' + location);
			console.log(location)
			if(journeyFlag)
			{
				if (location >= 36) {
					location = location - 36;
				}
				var des = $('#' + location + '').position();
				var el = ($('.player' + memberTurn + ''))
				el.css("position", "absolute");
				el.animate({
					top: des.top + "px",
					left: des.left + "px"
				}, function() {
					el.remove().appendTo('#' + location + '').css("position", "");
					el.remove().appendTo('#' + location + '').css("top", "");
					el.remove().appendTo('#' + location + '').css("left", "");
					$("p").draggable();
					if (location == 4 || location == 15 || location == 24 || location == 32) {
						goldKey();
					}
					if(location == 18)
					{
						$('#dialogWrap').show(300)
						$('#dialogContent').text('다음 턴 부터 술 여행 시작');
						$('.tile').find($('.player' + memberTurn + '')).remove();
						$('#27').append(memberArr[memberTurn])
						journeyFlag = false;	
					}
				});

			}
			else
			{
				
				journey(diceTotal);
			}
		}

		function goldKey() {
			var randomCount = Math.floor(Math.random() * goldKeyOption.length);
			$('#goldKeyContent').text(goldKeyOption[randomCount]);
			$('#goldKeyWrap').show(300);
		}

		function journey(diceTotal) {
			var location = currentLoaction + diceTotal;
			var currentLoaction = Number($('.player' + memberTurn + '').parent().attr('id'))
		}

		function drag() {
			$("p").draggable();
		}
		$(document).ready(function() {
			$('.card').click(function() {
				$(this).toggleClass('flipped');
			});
			$('#closeCard').click(function(){
				
				$('#goldKeyWrap').hide(300)
				$('.card').removeClass('flipped');
			})
			$('#closeDialog').click(function(){
				$('#dialogWrap').hide(300);
			})
		})