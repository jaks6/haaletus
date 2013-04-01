$(document).ready(function(){

	callKandidaadidScript();

});


function callKandidaadidScript(){
	doComplete();
	$("#kandidaadid_form").on('submit',function(event){	//when the submit button ("OTSI") is pressed...
		
		event.preventDefault();
		var locationHash = window.location.hash;
		//console.log("locationHash = " + locationHash);
		setLocationHash(locationHash + "?" + $("#kandidaadid_form").serialize());
		contactServlet($("#kandidaadid_form").serialize()); //do the query with values from form fields.

		return false; 	//needed for AJAX .submit() stuff to work properly. without this line clicking
		//SUBMIT will refresh the entire page.
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
	
	//!TODO:
	// URL CHANGING
	$("#candidateList > tbody").remove();	//clear previous data from table body
	var fieldsPortionOfHash = window.location.hash.substring(12);
	$.getJSON('/rest/hello?' + query
//			, 
//			{
//		party: fields[0],	//pass parameters along (field values entered by the user on html page)
//		region: fields[1],
//		person:fields[2], 
//		id: fields[3] 
//			}
	,
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
//function playLoadingAnimation(delayTime){
//	$("#content").css("opacity", "0.4");
//	$("#pic").fadeIn(500);
//	$("#pic").fadeOut(500);
//
//	$('#content')
//	.delay(delayTime)
//	.queue( function(next){ 
//		$(this).css('opacity','1'); 
//		next(); 
//	});
//}
function loadingAnimation(action){
	if (action=="start"){
		$("#content").css("opacity", "0.4");
		$("#pic").fadeIn(500);
	} else if (action=="stop"){
		$("#pic").fadeOut(250);
		$("#content").css("opacity", "1");
	}
}   


