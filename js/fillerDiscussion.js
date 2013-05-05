$(document).ready(function() {
	$(".fillerPageBorder").on("keypress", "#forumTextArea",function(e){
		if (e.which == 13) {
			comment = document.getElementById("forumTextArea").value;
    		$(this).val('');
    		var newr = $('<tr><td class="comboCol">You</td><td>'+comment+'</td></tr>');
			$('#insertionRow').after(newr);
  		}
	});
});