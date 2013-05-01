$(document).ready(function(){
	kandidaadidInit();
});


//Displays current users Vote 
function displayVote(){
	if (userLoggedInBoolean()){
		var vote = getVote();
			if(vote!="" ){ 
				$("#k_inputs").prepend("<p style=\"text-align:left\">Teie hetkene h&auml;&aumll:</p>");
				$("#k_inputs p").append("<div id=\"currentVote\" style=\"border-style:1px solid\">"+vote+"</div>");
			}
	}
}


function kandidaadidInit(){
	doComplete();	//initialize autocomplete fields
	getDropdownOptions("region", "party");
	displayVote();	//display previous vote
	$("[name='otsiButton']").click(function(){	//when the submit button ("OTSI") is pressed...
		
		//updateURL
		setLocationHash("kandidaadid?" + $("#kandidaadid_form").serialize());
		contactServlet($("#kandidaadid_form").serialize()); //do the query with values from form fields.
		
		

		return false; 	//needed for AJAX .submit() stuff to work properly. without this line clicking
		//SUBMIT will refresh the entire page.
	});
}
/** fills table of candidates using data from HTML5 localStorage */
function fillFromStorage(){
	$("#candidateList > tbody").remove();	//clear previous data from table body

	var largestId = parseInt(localStorage["storage.largestId"]);
	//Käime läbi kandidaatide ID'd 1-st kuni kõige kõrgemani, mis storetud.
	//kui vahepeal on lünk (pole sellise id-ga kandidaati storitud, jätame vahele
	for ( var id=1; id <= largestId; id++){
		if ("storage.candidates."+id+".name" in localStorage){
			var name = localStorage["storage.candidates."+id+".name"];
			var region = localStorage["storage.candidates."+id+".region"];
			var party = localStorage["storage.candidates."+id+".party"];
			var votes = localStorage["storage.candidates."+id+".votes"];
		}
		
		appendRow2Table("candidateList", name, id, party, region, votes);
	}
}


function contactServlet(query){
	loadingAnimation("start");
	
	$("#candidateList > tbody").remove();	//clear previous data from table body
	$.getJSON('/rest/hello?' + query,
			function(data) {
				for (var candidate in data) {
					var name = data[candidate].name;
					var id = data[candidate].id;
					var region = data[candidate].region;
					var party = data[candidate].party;
					var votes =data[candidate].votes;
					
					
					             
					            
					addCandidate2Storage(candidate, id, name, region, party, votes);   	//store them in HTML5 localStorage           
					appendRow2Table("candidateList", name, id, party, region, votes);
				}
				
				//make clicking the kandidaadid table rows take "hover" class
				$("#candidateList tr").hover( function() {
				    $(this).toggleClass('hover');
				});
				
				//make the click actually navigate to candidate voting page
				$("#candidateList tr").click( function() {
				    window.location = $(this).find('a').attr('href');
				});
				
				loadingAnimation("stop")//if JSON request is done, stop animation
				
			}).fail(function(){
				console.log( "error" ); 
				if(localStorage["storage.totalCandidates"]!="0"){
					fillFromStorage();
				}
				loadingAnimation("stop")//if JSON request is done, stop animation
				}); //End of json request FAIL function
}

//appends a row to a table with specified ID with given args
function appendRow2Table(tableId, name, id, party, region, votes){
	$("#"+tableId).append(
			'<tr>\
			<td><a href="#haaletamine?kandidaat='+id+'"  >'+ name +'</a> </td>\
			<td>'+ id +'</td>\
			<td>'+ party +'</td>\
			<td>'+ region +'</td>\
			<td>'+ votes +'</td>\
	</tr>');
}

