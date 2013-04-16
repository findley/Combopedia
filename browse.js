$(document).ready(function() {

	prevHighlight = "allchars";

	$('#searchBar').keypress(function (e) {
  		if (e.which == 13) {
    		document.getElementById('searchBar').value="";
  		}

	});

	$(".side").click(function() {
		$("#"+prevHighlight).removeClass('active');
		$("#"+this.id).addClass('active');
		prevHighlight = this.id;
		ComboData.initTable();
		ComboData.fillComboData(this.id);
	});

	$("#data").on("click", '.fav', function ()  {
		//shoud be some stuff with the database...this isn't real code for the final thing
		for (var i = 0; i < comboData.length; i++) {
			var combo = comboData[i];
			if(combo['name']==$(this).closest('tr').find('td').first().html()){
				if(combo['favorite']){
					combo['favorite']=false;
				} else{
					combo['favorite']=true;
				}
			}
		}
		ComboData.initTable();
		ComboData.fillComboData(prevHighlight);
	});

	ComboData.initTable();
	ComboData.fillComboData();
	$("#data").tablesorter(); 

});


var ComboData = function() {};

ComboData.attributes = ['name', 'character', 'combo', 'type', 'damage', 'meterGain', 'meterDrain', 'difficulty', 'favorite'];

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
			favorite: false, 
		},
		{
			name: 'Super combo B',
			character: 'Teddie',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: false,		
		},
		{
			name: 'Super combo C',
			character: 'Aigis',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: false,		
		},
		{
			name: 'Super combo H',
			character: 'Yu Narukami',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: false,		
		},
		{
			name: 'Super combo D',
			character: 'Yosuke Hanamura',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: false,		
		},
		{
			name: 'Super combo E',
			character: 'Chie Satonaka',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: false,		
		},
		{
			name: 'Super combo F',
			character: 'Yukiko Amagi',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: false,		
		},
		{
			name: 'Super combo G',
			character: 'Kanji Tatsumi',
			type: 'jab',
			damage: 100,
			meterGain: 50,
			meterDrain: 20,
			difficulty: 3,
			favorite: false,		
		},
	];

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
				} else if(attribute=="favorite"){
					if(combo[attribute]){
						dataRow.append($('<td class="fav"><i class="icon-star"></i></td>'));
					} else{
						dataRow.append($('<td class="fav"><i class="icon-star-empty"></i></td>'));
					}
				} else{
					dataRow.append($('<td>').text(combo[attribute]));
				}
			}
			
		}
		$('#data tbody').append(dataRow);
		
		
	}


	$('#data').tablesorter();
};
	
	
	






var dataRow = function() {
	this.name = undefined;
	this.

	return
}