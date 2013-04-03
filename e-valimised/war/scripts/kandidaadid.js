$(document).ready(function(){
	kandidaadidInit();

});


function kandidaadidInit(){
	doComplete();
	getDropdownOptions();
	$("#kandidaadid_form").on('submit',function(event){	//when the submit button ("OTSI") is pressed...
		
		event.preventDefault();
		
		//updateURL
		setLocationHash("kandidaadid?" + $("#kandidaadid_form").serialize());
		
		contactServlet($("#kandidaadid_form").serialize()); //do the query with values from form fields.

		return false; 	//needed for AJAX .submit() stuff to work properly. without this line clicking
		//SUBMIT will refresh the entire page.
	});
}

function getDropdownOptions(){
	
	$.getJSON('/rest/partiesandregions' ,  function(data){
		for (var region in data[0]) {
			$("select[name=region]").append('<option value="'+data[0][region]+'">'+data[0][region]+'</option>');
		}
		for (var party in data[1]) {
			$("select[name=party]").append('<option value="'+data[1][party]+'">'+data[1][party]+'</option>');
		}
	});
	
	
}

// .serialize() function of jQuery removes the need for the following function!! (.serialize() used in contactServlet())
function getFieldValues(){
	var party = $("select[name=party]").val();
	var region = $("select[name=region]").val();
	var person = $("input[name=person]").val();
	var personid = $("input[name=id]").val();

	return new Array(party, region, person, personid);
}



function contactServlet(query){
	loadingAnimation("start");
	//var fields=getFieldValues();
	
	$("#candidateList > tbody").remove();	//clear previous data from table body
	var fieldsPortionOfHash = window.location.hash.substring(12);
	$.getJSON('/rest/hello?' + query,
			function(data) {
//				var items = [];
				for (var candidate in data) {
					var name = data[candidate].name;
					var id = data[candidate].id;
					var region = data[candidate].region;
					var party = data[candidate].party;
					var votes =data[candidate].votes;
					appendRow2Table("candidateList", name, id, party, region, votes);
				}
				loadingAnimation("stop")//if JSON request is done, stop animation
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

function loadingAnimation(action){
	if (action=="start"){
		$("#content").css("opacity", "0.4");
		$("#pic").fadeIn(500);
	} else if (action=="stop"){
		$("#pic").fadeOut(250);
		$("#content").css("opacity", "1");
	}
}   


