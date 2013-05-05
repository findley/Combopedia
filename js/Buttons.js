var NextPageBtn = function() {
	var btn = $('<button class="btn btn-large" type="button"></button>');
	var next = $('<i class="icon-double-angle-right">');
	next.css({
		'font-size': 15px;
	});
	btn.append(next);
	return btn;
};