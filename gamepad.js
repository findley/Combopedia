
// All valid joystick moves
var VALID_JOYSTICK = ["", "1","2","3","4","5","6","7","8","9","214","236","412","478","632","698","874","896","21478","23698","41236","47896","63214","69874","87412","89632","2147896","2369874","4123698","4789632","6321478","6987412","8741236","8963214"];
var VALID_BUTTON = ["", "A","AB","ABC","ABCD","ABD","AC","ACD","AD","B","BC","BCD","BD","C","CD","D"];

// Returns a list of the next numbers in all valid joystick moves that begin with a given string of numbers
var validNext = function (start) {
    var valid = []
    for (var i = 0;i<VALID_JOYSTICK.length;i++) {
        move = VALID_JOYSTICK[i];
        if(move.length > start.length && move.indexOf(start) == 0) {
            valid.push(move[start.length]);
        }
    }
    return valid;
}

var isValid = function(nums, btns) {
    return VALID_JOYSTICK.indexOf(nums) >= 0 && VALID_BUTTON.indexOf(btns) >= 0;
}

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
	
	

    
	// The buttons
	var topPane = $('<div>')
	                .attr('id','topPane')
	                .css({'clear': 'both', 'overflow' : 'hidden', 'text-align': 'center'});
        	
	var clearMoveBtn = function() {
		var btn = $('<button id="clearMove" class = "btn btn-large btn-danger">').text("Clear Move");
		btn.click(function() {
            resetGamepad()
		});
		return btn;
	}

    var numImage = function() {
        return $('<div id="numImage"><img class="img-polaroid" /></div>');
    }
    
    var btnImage = function() {
        return $('<div id="btnImage"><img class="img-polaroid" /></div>');
    }
    
	var addMoveBtn = function() {
		var btn = $('<button id="addMove" class = "btn btn-large btn-primary">').text("Add to Combo");
		btn.click(function() {
			addMove(Gamepad.inputQueue);
		});
		return btn;
	}
	
	topPane.append(new clearMoveBtn());
	topPane.append(new numImage());
	topPane.append(new btnImage());
	topPane.append(new addMoveBtn());
	
	// The joystick controls of the gamepad
	var AIMING_CIRCLE_WIDTH = 300;
	var AIMING_CIRCLE_HEIGHT = 300;
	var AIMING_CIRCLE_OFFSET = 30;
	
	var AimingCircle = function() {
		var aimingCircle = $('<div>')
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
			positionNumpadElt($(this), KNOB_WIDTH, KNOB_HEIGHT, 5);
			Gamepad.inputQueue.length = 0;
            updateFromInternal();
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
				if (num != 5 && validNext(Gamepad.inputQueue.join('').trim()).indexOf(String(num)) >= 0) {
					Gamepad.inputQueue.push(num);
					pos.addClass('active');
					$('#joystickFeedback').val(Gamepad.inputQueue.join(''));
                    updateFromInternal();
				}
			},
		});
		
		//TODO: will not drag back to 5
		pos.click(function() {
			Knob.position(knob, num);

			if ( num== 5 ) {
				Gamepad.inputQueue.length = 0;
				$('.position.active').removeClass('active');
			} else {
				Gamepad.inputQueue.push(num);
				pos.addClass('active');
			}
			$('#joystickFeedback').val(Gamepad.inputQueue.join(''));
			updateFromInternal();
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
		
		btn.mousedown(function() {
			btn.toggleClass('active');
			var selected = '';
			$('.gpBtn.active').each(function(idx, elt) {
				selected += $(elt).attr('val');
			});
			Gamepad.btnSel = selected;
			$('#btnFeedback').text(Gamepad.btnSel);
			updateFromInternal();
		});
		return btn;
	}
					
	buttonContainer.append(new gpBtn('A'));
	buttonContainer.append(new gpBtn('B'));
	buttonContainer.append(new gpBtn('C'));
	buttonContainer.append(new gpBtn('D'));
	
	/* Feedback */
	var gpFeedback = $('<div id="gpFeedback">');

	
	var JoystickFeedback = function() {
		var joystickFeedback = $('<textarea id="joystickFeedback">')
								.css({
								});
		//TODO: error handling!
		joystickFeedback.on('keyup', function() {
    		updateFromBoxes();
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
			nums = Gamepad.inputQueue.join('');
		if (Gamepad.btnSel != undefined) 
			btns = Gamepad.btnSel;
				
		if (VALID_JOYSTICK.indexOf(nums) == -1)
		    return;
		
		var move = $('<li class="singleMove"><i class="pull-right icon-trash"></i></li>');
		
		var text = $('<div>').addClass('moveText').text(nums + btns);
		var img = $('<div>').addClass('moveImg');
		
		if (nums.length > 0)
			img.append($('<img>').attr('src', 'img/moves/' + nums.trim() + '.png'));
		else
			img.append($('<img>').attr('src', 'img/moves/5.png'));
			
		if (btns.length > 0)		
		    img.append($('<img>').attr('src', 'img/moves/' + btns.trim() + '.png'));
		else
		    img.append($('<img>').attr('src', 'img/moves/none.png'));		
		
		move.append(text);
		move.append(img);
		
//		move.sortable();
		return move;
	}
		
	var addMove = function() {
		if (Gamepad.inputQueue.length > 0 || Gamepad.btnSel != '') {
		    if(isValid(Gamepad.inputQueue.join("").trim(),Gamepad.btnSel.trim())) {
                var move = new Move();
                $("#moves").append(move);
                resetGamepad();
            } else {
                resetGamepad();
            }            
		}
	}
	
	var resetGamepad = function() {
		Gamepad.inputQueue = [];
		$('#joystickFeedback').val('');
		Gamepad.btnSel = '';
		$('#btnFeedback').text('');
		Knob.position(knob, 5);
		$('.active').removeClass('active');
		updateFromInternal();
	}

	// place the components in the gamepad
	gamepad.append(topPane);
	gamepad.append(aimingCircle);
	gamepad.append(buttonContainer);
	aimingCircle.append(knob);
	for (var i = 1; i <10; i++) {
		aimingCircle.append(new Position(i));
	}	
	gamepad.append(gpFeedback);



	// Makes sure all of the UI is consistant with the internal representation
	var updateFromInternal = function() {
		var nums = '';
		var btns = '';
		if (Gamepad.inputQueue != undefined) 
			nums = Gamepad.inputQueue.join('');
		if (Gamepad.btnSel != undefined) 
			btns = Gamepad.btnSel;		
		var nextMoves = validNext(nums);

        $('#joystickFeedback').val(nums);
		$('#btnFeedback').text(btns);
		
    	for (var i = 1; i <10; i++) {
            $("#position-" + i).removeClass('active');
            $("#position-" + i).removeClass('deactive');
            if(nums.indexOf(String(i)) >= 0)
                $("#position-" + i).addClass('active');
            else
                if(nextMoves.indexOf(String(i)) < 0) 
                    $("#position-" + i).addClass('deactive');
    	}
    	
    	if (VALID_JOYSTICK.indexOf(nums) >= 0) {
            if (nums.length > 0) {
				var img = $('<img>');
                img.attr('src', 'img/moves/' + nums.trim() + '.png');
				$('#numImage').empty().append(img);
			} else { 
				var img = $('<img>');
                img.attr('src', 'img/moves/5.png');
				$('#numImage').empty().append(img);
			}
            $('#numImage').css({'border-color' : 'black'});        
            $('#addMove').removeClass('disabled');            
        } else {
            $('#numImage').css({'border-color' : 'red'});
			$('#numImage').empty().text('INVALID');
            $('#addMove').addClass('disabled'); 
        }
        
		if (VALID_BUTTON.indexOf(btns) >= 0) {
            if (btns.length > 0) {		
				var img = $('<img>');
                img.attr('src', 'img/moves/' + btns.trim() + '.png');
				$('#btnImage').empty().append(img);
			}
            else {
				var img = $('<img>');
                img.attr('src', 'img/moves/none.png');
				$('#btnImage').empty().append(img);
			}
            $('#btnImage').css({'border-color' : 'black'});
        } else {
            $('#btnImage').css({'border-color' : 'red'});
        }
        
    	
    	
	};

    // Makes sure the internal state and UI is consistant with the content of the text boxes
	var updateFromBoxes = function() {
		var nums = '';
		var btns = '';
        try {
            Gamepad.inputQueue = $('#joystickFeedback').val().trim().split("");
            Gamepad.btnSel = $('#btnFeedback').text().trim();

            //place knob
            var num = Gamepad.inputQueue[Gamepad.inputQueue.length-1];			
            if (num.length > 0 && 0 <= parseInt(num) && parseInt(num) <= 9)
                Knob.position(knob, num);
                
            updateFromInternal();
        }
        catch (err) {
        };
	};
	
    	gamepad.ready(function(){resetGamepad();} );
	
	return gamepad;
}


