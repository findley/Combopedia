$(document).ready(function() {
	$("#metaDataForm").submit(function(e){
		e.preventDefault();
		$(location).attr('href','./joystick.html');	
	});

	$("div.star-rating > s").on("click", function(e) {
        var numStars = parseInt($(e.target)[0].className[0])+1;
        setStars(numStars);
        $("#fireRating").removeClass("star-rating").removeClass();
        $("#fireRating").addClass(numStars.toString()).addClass("star-rating");
    });

    $("div.star-rating > s").hover(
    	 function () {
 			var numStars = parseInt($(this)[0].className[0])+1;
 			setStars(numStars);
 	 	},
  		function () {
 			var num = $("#fireRating").attr("class")[0];
 			setStars(num)
		}
);

});

var setStars = function(num){
        var par = $("#fireRating").children();

        for (var st = 0; st < num; st++){
        	par[st].className=st+" icon-fire";
        }

        for (var ar = num; ar < 5; ar++){
        	par[ar].className=ar+" icon-fire icon-white";
        }
}