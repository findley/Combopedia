var Gamepad = function() {
	this.inputQueue = [];

	var DEBUG = false;

	// TODO: make this an object
	var gamepad = $('<div id="gamepad">')
					.css({
						'border': '1px solid red',
						'width': 500,
						'height': 450,
						'position': 'relative',
						'padding': 10,
					});
	
	

	
	// The joystick controls of the gamepad
	var AIMING_CIRCLE_WIDTH = 300;
	var AIMING_CIRCLE_HEIGHT = 300;
	var AIMING_CIRCLE_OFFSET = 30;
	
	var AimingCircle = function() {
		var aimingCircle = $('<div>')
							.css({
								'width': AIMING_CIRCLE_WIDTH,
								'height': AIMING_CIRCLE_HEIGHT,
								'position': 'relative',
								'margin': 15,
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
	
	var Knob = function(inputQueue) {
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
							if (inputQueue.length == 0) {
								Knob.position(knob, 5);
							} else {
								var lastPos = inputQueue[inputQueue.length-1];
								Knob.position(knob, lastPos);
							}
						},
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
			addMove(inputQueue);
			positionNumpadElt($(this), KNOB_WIDTH, KNOB_HEIGHT, 5);
			$('.position').removeClass('active');
			inputQueue.length = 0;
		});
		
		
		
		if (DEBUG == true) knob.css('border', '1px solid green');
		
		return knob;	
	};

	var knob = new Knob(this.inputQueue);
	
	// The directional indicators of the joystick controls
	// Placement is initialized with numpad direction placement
	var POS_WIDTH = 50;
	var POS_HEIGHT = 50;
	
	var Position = function(num, inputQueue) {
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
				if (num != 5 && inputQueue[inputQueue.length-1] != num) {
					inputQueue.push(num);
					pos.addClass('active');
					joystickFeedback.text(inputQueue);
				}
			},
		});
		
		//TODO: does not position as intended
		pos.click(function() {
			Knob.position(knob, num);
//			positionNumpadElt(knob, KNOB_WIDTH, KNOB_HEIGHT, num);

			if ( num== 5 ) {
				addMove(inputQueue);
				inputQueue.length = 0;
				$('.active').removeClass('active');
			} else {
				inputQueue.push(num);
				pos.addClass('active');
			}
			joystickFeedback.text(inputQueue);
		});

		
		return pos;
	};
	

	var JoystickFeedback = function() {
		var joystickFeedback = $('<div id="joystickFeedback">')
								.css({
									'border': '1px solid green',
									'width': 400,
									'height': 100,
								});
		return joystickFeedback;
	}
	
	// Code for being able to add single moves
	
	$('#moves').sortable({
		cursor: 'move',
	});


	
	var Move = function(inputQueue) {
		var move = $('<li class="singleMove">'+inputQueue.join('')+'<i class="pull-right icon-trash"></i><i class="pull-right icon-hand-up"></i></li>');
		
		move.sortable();
		return move;
	}

	
	var addMove = function(inputQueue) {
		var move = new Move(inputQueue);
		$("#moves").append(move);
	}
	
	
	var joystickFeedback = new JoystickFeedback();
	
	// place the components in the gamepad
	gamepad.append(aimingCircle);
	aimingCircle.append(knob);
	for (var i = 1; i <10; i++) {
		aimingCircle.append(new Position(i, this.inputQueue));
	}	
	gamepad.append(joystickFeedback);
	
	



	return gamepad;
}


