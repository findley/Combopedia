$(document).ready(function() {

	gp = new Gamepad();

	$('#container-gamepad').append(gp);

	$("#addMoveButton").click(function(){
		moves = gp.find("#joystickFeedback").html();
		gp.find("#joystickFeedback").html("");
		$("#moves").append('<li>'+moves+'<i class="pull-right icon-trash"></i><i class="pull-right icon-hand-up"></i></li>');
	});

});