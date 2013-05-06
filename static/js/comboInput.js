$(document).ready(function() {

	$('#inputCarousel').carousel({
		interval: false,
	}).on('slid', function() {
		$('.stage').removeClass('active');
		if ($('#inputCarouselInner').children(':first').hasClass('active')) {
			$('.carousel-control.left').hide();
			$('.carousel-control.right').show();
			$('#comboDataProgress').addClass('active');
		} else if ($('#inputCarouselInner').children(':last').hasClass('active')) {
			$('.carousel-control.left').show();
			$('.carousel-control.right').hide();
			$('#confirmationProgress').addClass('active');
		} else {
			$('.carousel-control.left').show();
			$('.carousel-control.right').show();
			$('#moveInputProgress').addClass('active');
		}
	});
	
	// initialized to first slide
	$('.carousel-control.left').hide();
	
	$('#comboDataProgress').click(function() {
		$('#inputCarousel').carousel(0);
	});
	$('#moveInputProgress').click(function() {
		$('#inputCarousel').carousel(1);
	});
	$('#confirmationProgress').click(function() {
		$('#inputCarousel').carousel(2);
	});
	
	
	
	// combo data
	$('#charSelect').change(function() {
		var firstName = $('#charSelect').val().split(' ')[0].toLowerCase();
		loadNewCharImg(firstName);
	});
	
	
	var loadNewCharImg = function(firstName) {
		// snippet taken from http://jqueryfordesigners.com/image-loading/
		$('#charImg').addClass('loading').append('<i class="icon-spinner icon-spin">');
		var img = new Image();
		$(img)
			.load(function () {
				$(this).hide();
			$('#charImg')
			.removeClass('loading')
			.empty()
			.css('background-image', 'url("/static/img/characters/' + firstName + '_full.png")');
		  $(this).fadeIn();
		})
		.error(function () {
		})
		 .attr('src', '/static/img/characters/' + firstName + '_full.png');
	}
	
	// gamepad
	var gp = new Gamepad();
	$('#container-gamepad').append(gp);
	
		
	$('.loading').remove();
	

	
	
});