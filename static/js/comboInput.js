$(document).ready(function() {
    var checkDataProgress = function() {
        var dataComplete = true;
        $('#metaDataForm :input').each(function(idx, val) {
            if ($(val).val() == "") dataComplete = false;
        }); 
        if (dataComplete)
            $('#comboDataProgress > span').css({'color': 'green'})
                                          .text('Complete!');
        else
            $('#comboDataProgress > span').css({'color': 'red'})
                                          .text('INCOMPLETE');
    };

    $('#metaDataForm :input').change(function() {
        checkDataProgress();
    });

    checkInputProgress = function() {
        if ($('#moves').children().length > 0)
            $('#moveInputProgress > span').css({'color': 'green'})
                                          .text('Complete!');
        else
            $('#moveInputProgress > span').css({'color': 'red'})
                                          .text('INCOMPLETE');
    };

    $('#moves').bind('DOMNodeInserted DOMNodeRemoved DOMSubtreeModified', function() {
        checkInputProgress();
    });

	$('#inputCarousel').carousel({
		interval: false,
	}).on('slid', function() {
		$('.stage').removeClass('active');
		if ($('#inputCarouselInner').children(':first').hasClass('active')) {
			$('.carousel-control.left').hide();
			$('.carousel-control.right').show();
			//$("#step1complete").html("INCOMPLETE").css({'color':'red'});
			//$("#step2complete").html("Completed!").css({'color':'green'});
			$('#comboDataProgress').addClass('active');
		} else if ($('#inputCarouselInner').children(':last').hasClass('active')) {
			$('.carousel-control.left').show();
			$('.carousel-control.right').hide();
			//$("#step1complete").html("Completed!").css({'color':'green'});
			//$("#step2complete").html("Completed!").css({'color':'green'});
			$('#confirmationProgress').addClass('active');
		} else {
			$('.carousel-control.left').show();
			$('.carousel-control.right').show();
			//$("#step1complete").html("Completed!").css({'color':'green'});
			//$("#step2complete").html("INCOMPLETE").css({'color':'red'});
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
