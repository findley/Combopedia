var Gamepad = function() {
	this.inputQueue = [];

	var DEBUG = true;

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
	var AIMING_CIRCLE_WIDTH = 200;
	var AIMING_CIRCLE_HEIGHT = 200;
	var AIMING_CIRCLE_OFFSET = 20;
	
	var AimingCircle = function() {
		var aimingCircle = $('<div>')
							.css({
								'width': AIMING_CIRCLE_WIDTH,
								'height': AIMING_CIRCLE_HEIGHT,
								'position': 'relative',
								'margin': 15,
								'-webkit-border-radius': 100,
								'-moz-border-radius': 100,
							});
		
		if (DEBUG == true) aimingCircle.css('border', '1px solid blue');
		
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
					.draggable({
						// 'revert': 'invalid',
						// 'revertDuration': 80,
						'containment': 'parent',
						'stop': function() {
							if (inputQueue.length == 0) {
								positionNumpadElt(knob, KNOB_WIDTH, KNOB_HEIGHT, 5);
							} else {
								var lastPos = inputQueue[inputQueue.length-1];
								var lastPosOffset = $('#position-' + lastPos).offset();
								$(knob).offset({
									top: lastPosOffset.top - (KNOB_HEIGHT - POS_HEIGHT)/2, 
									left: lastPosOffset.left - (KNOB_WIDTH - POS_WIDTH)/2
								});
							}
						},
					});
		
		positionNumpadElt(knob, KNOB_WIDTH, KNOB_HEIGHT, 5);

		//TODO: circle containment
		//var angle = 
		
		// when clicked, return to neutral position
		knob.on('click', function() {
			inputQueue.length = 0;
			positionNumpadElt($(this), KNOB_WIDTH, KNOB_HEIGHT, 5);
			$('.position').removeClass('active');

		});
		
		
		
		if (DEBUG == true) knob.css('border', '1px solid green');
		
		return knob;	
	};

	
	// The directional indicators of the joystick controls
	// Placement is initialized with numpad direction placement
	var POS_WIDTH = 30;
	var POS_HEIGHT = 30;
	
	var Position = function(num, inputQueue) {
		var name = 'position-' + num;
		var pos = $('<div>')
				.addClass('position')
				.attr('id', name)
				.css({
					'position': 'absolute',
					'width': POS_WIDTH,
					'height': POS_HEIGHT,
				});
		
		positionNumpadElt(pos, POS_WIDTH, POS_HEIGHT, num);
		pos.text(num);
		
		if (DEBUG == true) pos.css('border', '1px solid purple');
		
		pos.droppable({
			drop: function(e, ui) {
				$(ui.draggable).css({border: '1px dotted green'});
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
		
		return pos;
	};
	

	var JoystickFeedback = function() {
		var joystickFeedback = $('<div>')
								.css({
									'border': '1px solid green',
									'width': 400,
									'height': 100,
								});
		return joystickFeedback;
	}
	var joystickFeedback = new JoystickFeedback();
	
	// place the components in the gamepad
	gamepad.append(aimingCircle);
	aimingCircle.append(new Knob(this.inputQueue));
	for (var i = 1; i <10; i++) {
		aimingCircle.append(new Position(i, this.inputQueue));
	}	
	gamepad.append(joystickFeedback);

	return gamepad;
}