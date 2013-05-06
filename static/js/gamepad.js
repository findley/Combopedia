
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
        	
	$('#clearMove').click(function() {
		resetGamepad();
	});
	$('#addMove').click(function() {
		addMove(Gamepad.inputQueue);
	});
	
	// The joystick controls of the gamepad
	var AIMING_CIRCLE_WIDTH = 270;
	var AIMING_CIRCLE_HEIGHT = 270;
	var AIMING_CIRCLE_OFFSET = 25;
	
	var AimingCircle = function() {
		var aimingCircle = $('<div>')
							.css({
								'width': AIMING_CIRCLE_WIDTH,
								'height': AIMING_CIRCLE_HEIGHT,
								'-webkit-border-radius': AIMING_CIRCLE_WIDTH/2,
								'-moz-border-radius': AIMING_CIRCLE_WIDTH/2,
							})
							.attr('id', 'aimingCircle');
		
		
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
					.append($('<img src="./static/img/joystick/selected.png">'));
					
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
			updateFromInternal();
		});
		
		return pos;
	};	

	// button inputs
	var buttonContainer = $('<div>').attr('id', 'buttonContainer');
							
							
	var BTNDIM = [50, 50];
	var gpBtn = function(val) {
		var btn = 
			$('<div>')
			.attr('id', 'btn' + val)
			.attr('val', val)
			.addClass('gpBtn');
		
		btn.mousedown(function() {
			btn.toggleClass('active');
			var selected = '';
			$('.gpBtn.active').each(function(idx, elt) {
				selected += $(elt).attr('val');
			});
			Gamepad.btnSel = selected;
			updateFromInternal();
		});
		return btn;
	}
					
	buttonContainer.append(new gpBtn('A'));
	buttonContainer.append(new gpBtn('B'));
	buttonContainer.append(new gpBtn('C'));
	buttonContainer.append(new gpBtn('D'));
	
	/* Feedback */

	$('#textMoveInput').on('keyup', function() {
		parseTextInput();
	});
	
	// Code for being able to add single moves
	
	$('#moves').sortable({
		cursor: 'move',
		containment: '#moveList',
	}).css({
		padding: 0,
		margin: 0,
	
	});
	
	$("#moves").on("click", '.singleMove', function (e){
		if(e.target.className=="pull-right icon-trash"){
			$(this).closest('li').remove();
		} 
	});


	//TODO: clear input if text area is none
	var Move = function() {
		var nums = '';
		var btns = '';
		if (Gamepad.inputQueue != undefined) 
			nums = Gamepad.inputQueue.join('');
		if (nums == '')
			nums = '5';
		if (Gamepad.btnSel != undefined) 
			btns = Gamepad.btnSel;
				
		// if (VALID_JOYSTICK.indexOf(nums) == -1)
		    // return;
		
	
		
		var move = $('<li class="singleMove"></li>');
		var trash = $('<i class="pull-right icon-trash del-move">');
		move.append(trash);

		
		trash.hover(
			function() {
				$($(this).closest('li')).addClass('delHover');
			},
			function() {
				$($(this).closest('li')).removeClass('delHover');		
			}
		);
		
		trash.click(function() {
			move.remove();
		});
		
		var text = $('<div>').addClass('moveText').text(nums + btns);
		var img = $('<div>').addClass('moveImg');
		
		if (nums.length > 0)
			img.append($('<img>').attr('src', './static/img/moves/' + nums.trim() + '.png'));
		else
			img.append($('<img>').attr('src', './static/img/moves/5.png'));
			
		if (btns.length > 0)		
		    img.append($('<img>').attr('src', './static/img/moves/' + btns.trim() + '.png'));
		else
		    img.append($('<img>').attr('src', './static/img/moves/none.png'));		
		
		move.append(text);
		move.append(img);
		
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
		Gamepad.btnSel = '';
		Knob.position($('#knob'), 5);
		$('.position.active').removeClass('active');
		$('.gpBtn.active').removeClass('active');
		updateFromInternal();
	}

	// place the components in the gamepad

	gamepad.append(buttonContainer);
	gamepad.append(aimingCircle);
	aimingCircle.append(knob);
	for (var i = 1; i <10; i++) {
		aimingCircle.append(new Position(i));
	}	



	// Makes sure all of the UI is consistent with the internal representation
	var updateFromInternal = function() {
		var nums = '';
		var btns = '';
		if (Gamepad.inputQueue != undefined) 
			nums = Gamepad.inputQueue.join('');
		if (Gamepad.btnSel != undefined) 
			btns = Gamepad.btnSel;		
		var nextMoves = validNext(nums);


		$('#textMoveInput > textarea').val(nums + btns);
		
    	for (var i = 1; i <10; i++) {
            $("#position-" + i).removeClass('active');
            $("#position-" + i).removeClass('deactive');
            if(nums.indexOf(String(i)) >= 0)
                $("#position-" + i).addClass('active');
            else
                if(nextMoves.indexOf(String(i)) < 0) 
                    $("#position-" + i).addClass('deactive');
    	}
    	
		$('.gpBtn').removeClass('active');
    	if (VALID_JOYSTICK.indexOf(nums) >= 0) {
            if (nums.length > 0) {
				var img = $('<img>');
                $('#numImage').attr('src', './static/img/moves/' + nums.trim() + '.png');
				// $('#numImage').empty().append(img);
			} else { 
				var img = $('<img>');
                img.attr('src', './static/img/moves/5.png');
				$('#numImage').empty().append(img);
			}
            $('#numImage').css({'border-color' : 'black'});        
            $('#addMove').removeClass('disabled');            
        } else {
            $('#numImage').css({'border-color' : 'red'});
            $('#addMove').addClass('disabled'); 
        }
        
		
		if (VALID_BUTTON.indexOf(btns) >= 0) {
            if (btns.length > 0) {		
				var img = $('<img>');
                img.attr('src', './static/img/moves/' + btns.trim() + '.png');
				$('#btnImage').empty().append(img);
				
				var eachBtn = btns.split('');
				$.each(eachBtn, function(i,v) {
					$('#btn' + v).addClass('active');
				});
			}
            else {
				var img = $('<img>');
                $('#btnImage').attr('src', './static/img/moves/none.png');
				// $('#btnImage').empty().append(img);
			}
            $('#btnImage').css({'border-color' : 'black'});
        } else {
            $('#btnImage').css({'border-color' : 'red'});
        }
        
		var previewMove = new Move().addClass('preview');
    	$('#previewMove').html('').append(previewMove);
    	
	};


	
	var parseTextInput = function() {
		var intRegex = /[1-9]/;
		var letterRegex = /[a-dA-D]/;
		var inp = $('#textMoveInput > textarea').val().trim().split("");
		var joystickQueue = [];
		var btnQueue = [];
		var btnQueueUnique = [];
		var idx = 0;
		// parse numbers until you reach a letter or nondelimiter
		
		$.each(inp, function(i, v) {
			if (v == ' ' || v == ',') 
				return true; // continue
			if(intRegex.test(v)) {
				joystickQueue.push(parseInt(v));
			} else {
				idx = i;
				return false; //  break
			}
		});
		Gamepad.inputQueue = joystickQueue;
		
		// parse letters until you reach a non-letter		
		$.each(inp.slice(idx), function(i, v) {
			if (v == ' ' || v == ',') 
				return true; // continue
			if(letterRegex.test(v)) {
				btnQueue.push(v);
			} else {
				return false; // break
			}
		});

		// sort and remove duplicates
		btnQueue.sort();

		$.each(btnQueue, function(idx, elt){
			if($.inArray(elt, btnQueueUnique) === -1) btnQueueUnique.push(elt.toUpperCase());
		});
		
        var num = Gamepad.inputQueue[joystickQueue.length-1];			
		if (num!=undefined && num.length > 0 && 0 <= parseInt(num) && parseInt(num) <= 9)
			Knob.position($('#knob'), num);
		Gamepad.btnSel = btnQueueUnique.join('');

			
		updateFromInternal();
	};
	
    gamepad.ready(function(){resetGamepad();} );
	
	return gamepad;
}


