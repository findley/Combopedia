$(document).ready(function() {
	$('#loginForm').modal({show: false});

	$('#loginForm').submit(function(e) {
		e.preventDefault();
		if (!verifyLogin()) {
			$('#loginModal').modal('show');
		}
			
	});
	
	
	var verifyLogin = function() {
		// ajax calls
		return false;
	};
});