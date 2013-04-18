$(document).ready(function() {

	gp = new Gamepad();

	$('#container-gamepad').append(gp);

	$("#moves").on("click", '.singleMove', function (e){
		if(e.target.className=="pull-right icon-trash"){
			$(this).closest('li').remove();
		} 
	});

	$(".singleMove").draggable();

});