$(document).ready(function() {
	ComboData.initTable();
	ComboData.fillComboData();
});


var ComboData = function() {};

ComboData.attributes = ['name', 'character', 'combo', 'type', 'damage', 'meterGain', 'meterDrain', 'difficulty', 'favorite'];

ComboData.initTable = function() {
	var dataRow = $('<tr>');
	for (var j = 0; j < ComboData.attributes.length; j++) {
		var attribute = ComboData.attributes[j];
		var capitalized = attribute.charAt(0).toUpperCase() + attribute.slice(1);
		dataRow.append($('<th>').text(capitalized));
	}
	$('#data').append(dataRow);
};
		
ComboData.fillComboData = function() {
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
			character: 'Teddie',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: true,		
		},
		
	];
		
		
	for (var i = 0; i < comboData.length; i++) {
		var combo = comboData[i];
		var dataRow = $('<tr>');
		for (var j = 0; j < ComboData.attributes.length; j++) {
			var attribute = ComboData.attributes[j];
			if(attribute=="combo"){
				dataRow.append($('<td id="comboCol">').text(combo[attribute]));
			} else{
				dataRow.append($('<td>').text(combo[attribute]));
			}
			
		}
		$('#data').append(dataRow);
		
		
	}

};
	
	
	






var dataRow = function() {
	this.name = undefined;
	this.

	return
}