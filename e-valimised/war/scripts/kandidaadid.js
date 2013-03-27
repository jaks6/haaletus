$(document).ready(function(){
	callKandidaadidScript();

});


function callKandidaadidScript(){
	$("#kandidaadid_form").on('submit',function(){	//when the submit button ("OTSI") is pressed...
		contactServlet();
		playLoadingAnimation();
		setTimeout(function(){ //delay the following a bit.

			/*//Conditions to check which file to load.
		if ($("select[name=Partei]").val()!== ""){
			if ($("select[name=Piirkond]").val()!== ""){
				getCandidates('data/candidatesByRegionAndParty.json', 	//both region and party have been specified
						$("select[name=Piirkond]").val(), $("select[name=Partei]").val());

			} else {
				getCandidates('data/candidatesByParty.json', 			//just party has been specified
						undefined, $("select[name=Partei]").val());
			}
		} else {
			if ($("select[name=Piirkond]").val()!== ""){
				getCandidates('data/candidatesByRegion.json', 			//just region has been specified
						$("select[name=Piirkond]").val(), undefined);
			}
		}*/

		}, 1000);



		return false; 	//needed for AJAX .submit() stuff to work properly. without this line clicking
		//SUBMIT will refresh the entire page.
	});
}

function getFieldValues(){
	var party = $("select[name=Partei]").val();
	var region = $("select[name=Piirkond]").val();
	var person = $("input[name=Nimi]").val();
	var personid = $("input[name=ID]").val();

	return new Array(party, region, person, personid);



}

function contactServlet(){
	var fields=getFieldValues();
	// http://w3schools.com/jquery/ajax_getjson.asp
	//!TODO:
	// URL CHANGING
	// SELECT field values from DB
	$("#candidateList > tbody").remove();	//clear previous data from table body
	$.getJSON('kandidaadid_data', 
			{
		party: fields[0],	//pass parameters along (field values entered by the user on html page)
		region: fields[1],
		person:fields[2], 
		id: fields[3] 
			},
			function(data) {
				var items = [];
				for (var candidate in data) {
					var name = data[candidate].name;
					var id = data[candidate].id;
					var region = data[candidate].region;
					var party = data[candidate].party;
					var votes =data[candidate].votes;
					appendRow2Table("candidateList", name, id, party, region, votes);
				}
			});
	document.location.hash = "show_picture";
}

//fetches data from a predestined .json file, outputs it to the table with the id "candidateList"
function getCandidates(filename, region, party){

	//$("#candidateList > tbody").remove();	//clear previous data from table body

	//Create and set flags: if region/party is set, we dont need to start parsing them in the file.
	var regionUnset = false;
	var partyUnset = false;

	if (typeof(region)==='undefined'){
		regionUnset = true;
	}
	if (typeof(party)==='undefined'){
		partyUnset = true;
	}


	$.getJSON(filename, function(data) {	//fetch the json file.
		$.each(data.candidates, function(key, val){		//iterate over the list "candidates"

			var id = val.person.id;
			var name = val.person.name;

			if (regionUnset){	//if region wasnt specified, we must get it from the file
				region = val.region.name;
			}

			if (partyUnset){	//if party wasnt specified, we must get it from the file
				party = val.party.name;
			}

			appendRow2Table("candidateList", name, id, party, region, "X")
		});
	});
}
//appends a row to a table with specified ID with given args
function appendRow2Table(tableId, name, id, party, region, votes){
	$("#"+tableId).append(
			'<tr><td>'+ name +'</td>\
			<td>'+ id +'</td>\
			<td>'+ party +'</td>\
			<td>'+ region +'</td>\
			<td>'+ votes +'</td>\
	</tr>');
}
function playLoadingAnimation(){
	$("#content").css("opacity", "0.4");
	$("#pic").fadeIn(500);
	$("#pic").fadeOut(500);

	$('#content')
	.delay(1000)
	.queue( function(next){ 
		$(this).css('opacity','1'); 
		next(); 
	});
}   