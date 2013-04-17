$(document).ready(function() {

	gp = new Gamepad();

	$('#container-gamepad').append(gp);

	$("#addMoveButton").click(function(){
		moves = gp.find("#joystickFeedback").html();
		gp.find("#joystickFeedback").html("");
		$("#moves").append('<li class="singleMove">'+moves+'<i class="pull-right icon-trash"></i><i class="pull-right icon-hand-up"></i></li>');
	});

	$("#moves").on("click", '.singleMove', function (e){
		if(e.target.className=="pull-right icon-trash"){
			$(this).closest('li').remove();
		} 
	});

	//$("#moves").on("mousedown", '.singleMove', function (e){
		
	//});
	$(".singleMove").draggable();

});