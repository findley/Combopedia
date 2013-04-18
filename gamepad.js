var Gamepad = function() {
	Gamepad.inputQueue = [];
	Gamepad.btnSel = '';
	
	var DEBUG = false;

	// TODO: make this an object
	var gamepad = $('<div id="gamepad">')
					.css({
						'border': '1px solid black',
						'position': 'relative',
						'padding': 10,
					});
	
	

	
	// The joystick controls of the gamepad
	var AIMING_CIRCLE_WIDTH = 300;
	var AIMING_CIRCLE_HEIGHT = 300;
	var AIMING_CIRCLE_OFFSET = 30;
	
	var AimingCircle = function() {
		var aimingCircle = $('<div class="span4">')
							.css({
								'width': AIMING_CIRCLE_WIDTH,
								'height': AIMING_CIRCLE_HEIGHT,
								'-webkit-border-radius': AIMING_CIRCLE_WIDTH/2,
								'-moz-border-radius': AIMING_CIRCLE_WIDTH/2,
							})
							.attr('id', 'aimingCircle');
		
		//if (DEBUG == true) 
		//aimingCircle.css('border', '1px solid blue');
		
		return aimingCircle;
	};

	// Instantiate aiming circle for knob/position placement
	var aimingCircle = new AimingCircle();
	
	// Position the element in the aiming circle using numpad notation
	// eg. 5 goes in the center, 9 goes in the top right
	var positionNumpadElt = function(elt, width, height, num) {
		var offset = AIMING_CIRCLE_OFFSET;
		switch(num)
		{
			case 1:
				elt.css('top', aimingCircle.height() - width - offset)
				   .css('left', offset);
				break;
			case 2:
				elt.css('top', aimingCircle.height() - height)
				   .css('left', aimingCircle.width()/2 - width/2);
				break;
			case 3:
				elt.css('top', aimingCircle.height() - height - offset)
				   .css('left', aimingCircle.width() - width - offset);
				break;
			case 4:
				elt.css('top', aimingCircle.height()/2 - height/2)
				   .css('left', 0);
				break;
			case 5:
				elt.css('top', aimingCircle.height()/2 - height/2)
				   .css('left', aimingCircle.width()/2 - width/2);
				break;
			case 6:
				elt.css('top', aimingCircle.height()/2 - height/2)
				   .css('left', aimingCircle.width() - width);
				break;
			case 7:
				elt.css('top', offset)
				   .css('left', offset);
				break;
			case 8:
				elt.css('top', 0)
				   .css('left', aimingCircle.width()/2 - width/2);
				break;
			case 9:
				elt.css('top', offset)
				   .css('left', aimingCircle.width() - width - offset);
				break;				
		}

	};
	
	// The movable knob of the joystick controls
	var KNOB_WIDTH = 40;
	var KNOB_HEIGHT = 40;
	
	var Knob = function() {
		var knob = $('<div>')
					.addClass('knob')
					.css({
						'position': 'absolute',
						'width': KNOB_WIDTH,
						'height': KNOB_HEIGHT,
						'z-index': 10,
					})
					.attr('id', 'knob')
					.draggable({
						// 'revert': 'invalid',
						// 'revertDuration': 80,
						'containment': 'parent',
						'stop': function() {
							if (Gamepad.inputQueue.length == 0) {
								Knob.position(knob, 5);
							} else {
								var lastPos = Gamepad.inputQueue[Gamepad.inputQueue.length-1];
								Knob.position(knob, lastPos);
							}
						},
						'distance': 10,
					})
					.append($('<img src="img/joystick/selected.png">'));
					

		
		Knob.position = function(elt, positionNum) {
			var knob = elt;
			var posOffset = $('#position-' + positionNum).offset();
			$(knob).offset({
				 top: posOffset.top - (KNOB_HEIGHT - POS_HEIGHT)/2, 
				 left: posOffset.left - (KNOB_WIDTH - POS_WIDTH)/2
			});
		}
		
		positionNumpadElt(knob, KNOB_WIDTH, KNOB_HEIGHT, 5);


		// when clicked, return to neutral position
		knob.on('click', function() {
			// if (inputQueue.length == 0) addMove([5])
			// else addMove(inputQueue);
			positionNumpadElt($(this), KNOB_WIDTH, KNOB_HEIGHT, 5);
			$('.position').removeClass('active');
			Gamepad.inputQueue.length = 0;
			$('#joystickFeedback').val('');
		});
		
		
		
		if (DEBUG == true) knob.css('border', '1px solid green');
		
		return knob;	
	};

	var knob = new Knob();
	
	// The directional indicators of the joystick controls
	// Placement is initialized with numpad direction placement
	var POS_WIDTH = 50;
	var POS_HEIGHT = 50;
	
	var Position = function(num) {
		var name = 'position-' + num;
		var pos = $('<div>')
				.addClass('position')
				.attr('id', name)
				.css({
					'position': 'absolute',
					'width': POS_WIDTH,
					'height': POS_HEIGHT,
					//'background-image': 'url("img/unselected/' + num + '.png")',
					'background-size': POS_WIDTH + 'px ' + POS_HEIGHT + 'px',
				});
		
		positionNumpadElt(pos, POS_WIDTH, POS_HEIGHT, num);
		
		if (DEBUG == true) pos.css('border', '1px solid purple');
		
		pos.droppable({
			drop: function(e, ui) {
				if (DEBUG == true) $(ui.draggable).css({border: '1px dotted green'});
				positionNumpadElt($(ui.draggable), KNOB_WIDTH, KNOB_HEIGHT, num);
			},
			over: function(e, ui) {
				if (num != 5 && Gamepad.inputQueue[Gamepad.inputQueue.length-1] != num) {
					Gamepad.inputQueue.push(num);
					pos.addClass('active');
					$('#joystickFeedback').val(Gamepad.inputQueue.join(''));
				}
			},
		});
		
		//TODO: will not drag back to 5
		pos.click(function() {
			Knob.position(knob, num);

			if ( num== 5 ) {
				// addMove(inputQueue);
				Gamepad.inputQueue.length = 0;
				$('.position.active').removeClass('active');
			} else {
				Gamepad.inputQueue.push(num);
				pos.addClass('active');
			}
			$('#joystickFeedback').val(Gamepad.inputQueue.join(''));
		});

		
		return pos;
	};
	

	
	// button inputs
	var BTNCNTDIM = [250, 300];
	var buttonContainer = $('<div>')
							.attr('id', 'buttonContainer')
							.css({
								'width': BTNCNTDIM[0],
								'height': BTNCNTDIM[1],
							});
							
	
	var BTNDIM = [100, 100];
	var gpBtn = function(val) {
		var btn = 
			$('<div>')
			.attr('id', 'btn' + val)
			.attr('val', val)
			.addClass('gpBtn')
			.css({
				'width': BTNDIM[0],
				'height': BTNDIM[1],
			});
		
		btn.click(function() {
			btn.toggleClass('active');
			var selected = '';
			$('.gpBtn.active').each(function(idx, elt) {
				selected += $(elt).attr('val');
			});
			Gamepad.btnSel = selected;
			$('#btnFeedback').text(Gamepad.btnSel);
		});
		
		return btn;
	}
	


	var addMoveBtn = function() {
		var btn = $('<button id="addMove">').text("Add Move");
		btn.click(function() {
			addMove(Gamepad.inputQueue);
		});
		return btn;
	}
					
	buttonContainer.append(new gpBtn('A'));
	buttonContainer.append(new gpBtn('B'));
	buttonContainer.append(new gpBtn('C'));
	buttonContainer.append(new gpBtn('D'));
	buttonContainer.append(new addMoveBtn());
	
	
	/* Feedback */
	var gpFeedback = $('<div id="gpFeedback">');

	
	var JoystickFeedback = function() {
		var joystickFeedback = $('<textarea id="joystickFeedback">')
								.css({
									'width': AIMING_CIRCLE_WIDTH,
								});
		//TODO: error handling!
		joystickFeedback.on('keyup', function() {
			
			Gamepad.inputQueue = joystickFeedback.val().split('');
			var num = Gamepad.inputQueue[Gamepad.inputQueue.length-1];
			
			Knob.position(knob, num);
			$('#position-' + num).addClass('active');
	
			console.log(Gamepad.inputQueue);
		});
		return joystickFeedback;
	}

		gpFeedback.append(new JoystickFeedback());
	
	var BtnFeedback = function() {
		var btnFeedback = $('<div id="btnFeedback">')
							.css({
								'width': BTNCNTDIM[0],
							});
		return btnFeedback;
	};
	
	gpFeedback.append(new BtnFeedback());
	

	
	// Code for being able to add single moves
	
	$('#moves').sortable({
		cursor: 'move',
	});


	//TODO: clear input if text area is none
	var Move = function() {
		var nums = '';
		var btns = '';
		if (Gamepad.inputQueue != undefined) 
			nums = Gamepad.inputQueue.join('') + ' ';
		if (Gamepad.btnSel != undefined) 
			btns = Gamepad.btnSel;
		
		var move = $('<li class="singleMove"><i class="pull-right icon-trash"></i><i class="pull-right icon-hand-up"></i></li>');
		
		
		
		var text = $('<div>').addClass('moveText').text(nums + btns);
		var img = $('<div>')
				.addClass('moveImg')
				.append($('<img>').attr('src', 'img/moves/' + nums.trim() + '.png'))
				.append($('<img>').attr('src', 'img/moves/' + btns.trim() + '.png'));
		
		move.append(text);
		move.append(img);
		
//		move.sortable();
		return move;
	}


	
	
	var addMove = function() {
		if (Gamepad.inputQueue.length > 0 || Gamepad.btnSel != '') {
			var move = new Move();
			$("#moves").append(move);
			resetGamepad();
		}
	}
	
	var resetGamepad = function() {
		Gamepad.inputQueue = [];
		$('#joystickFeedback').val('');
		Gamepad.btnSel = '';
		$('#btnFeedback').text('');
		Knob.position(knob, 5);
		$('.active').removeClass('active');
	}
	
	// place the components in the gamepad
	gamepad.append(aimingCircle);
	gamepad.append(buttonContainer);
	aimingCircle.append(knob);
	for (var i = 1; i <10; i++) {
		aimingCircle.append(new Position(i));
	}	
	gamepad.append(gpFeedback);
	
	



	return gamepad;
}


