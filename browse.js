$(document).ready(function() {

	prevHighlight = "allchars";

	$(".side").click(function() {
		$("#"+prevHighlight).removeClass('active');
		$("#"+this.id).addClass('active');
		prevHighlight = this.id;
		ComboData.initTable();
		ComboData.fillComboData(this.id);
	});

	ComboData.initTable();
	ComboData.fillComboData();
	$("#data").tablesorter(); 

});


var ComboData = function() {};

ComboData.attributes = ['name', 'character', 'combo', 'type', 'damage', 'meterGain', 'meterDrain', 'difficulty', 'favorite'];

ComboData.initTable = function() {
	$('#data').html("<thead>");

	var dataRow = $('<tr>');
	for (var j = 0; j < ComboData.attributes.length; j++) {
		var attribute = ComboData.attributes[j];
		var capitalized = attribute.charAt(0).toUpperCase() + attribute.slice(1);
		dataRow.append($('<th>').text(capitalized));
	}
	$('#data thead').append(dataRow);
};
		
ComboData.fillComboData = function(charac) {
	// hard coded json data that would otherwise come from database
	var comboData = [
		{
			name: 'Super combo A',
			character: 'Teddie',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true, 
		},
		{
			name: 'Super combo B',
			character: 'Teddie',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true,		
		},
		{
			name: 'Super combo C',
			character: 'Aigis',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true,		
		},
		{
			name: 'Super combo H',
			character: 'Yu Narukami',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true,		
		},
		{
			name: 'Super combo D',
			character: 'Yosuke Hanamura',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true,		
		},
		{
			name: 'Super combo E',
			character: 'Chie Satonaka',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true,		
		},
		{
			name: 'Super combo F',
			character: 'Yukiko Amagi',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true,		
		},
		{
			name: 'Super combo G',
			character: 'Kanji Tatsumi',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true,		
		},
	];
	charac = typeof charac !== 'undefined' ? charac : "allchars";

	for (var i = 0; i < comboData.length; i++) {
		var combo = comboData[i];

		if(i==0){
			$('#data').append($('<tbody>'));
		}
			
		var dataRow = $('<tr>');

		for (var j = 0; j < ComboData.attributes.length; j++) {
			var attribute = ComboData.attributes[j];

			var firstName = combo["character"].split(" ")[0];
			if(charac=="allchars" || charac==firstName){
				if(attribute=="combo"){
					dataRow.append($('<td id="comboCol">').text(combo[attribute]));
				} else{
					dataRow.append($('<td>').text(combo[attribute]));
				}
			}
			
		}
		$('#data tbody').append(dataRow);
		
		
	}

};
	
	
	






var dataRow = function() {
	this.name = undefined;
	this.

	return
}