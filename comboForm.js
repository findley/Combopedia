$(document).ready(function() {
	$("#metaDataForm").submit(function(e){
		e.preventDefault();
		$(location).attr('href','./joystick.html');	
	});
});