$(document).ready(function() {


	$('#inputCarousel').carousel({
		interval: false,
		slid: function() {
				if ($('#inputCarouselInner').children(':first').hasClass('active')) {
					console.log('f');
				}
			}
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
	

});