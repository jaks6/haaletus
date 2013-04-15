$(document).ready(function(){
	displayVote();
	kandidaadidInit();
});


//Displays current users Vote 
function displayVote(){
	var vote = getVote();
	if(vote!=""){
		$("#k_inputs").prepend("<p style=\"text-align:left\">Teie hetkene h&auml;&aumll:</p>");
		$("#k_inputs p").append("<div id=\"currentVote\" style=\"border-style:1px solid\">"+vote+"</div>");
	}
	
}


function kandidaadidInit(){
	doComplete();
	getDropdownOptions("region", "party");
	$("#kandidaadid_form").on('submit',function(event){	//when the submit button ("OTSI") is pressed...
		
		event.preventDefault();
		
		//updateURL
		setLocationHash("kandidaadid?" + $("#kandidaadid_form").serialize());
		contactServlet($("#kandidaadid_form").serialize()); //do the query with values from form fields.

		return false; 	//needed for AJAX .submit() stuff to work properly. without this line clicking
		//SUBMIT will refresh the entire page.
	});
}



function contactServlet(query){
	loadingAnimation("start");
	
	$("#candidateList > tbody").remove();	//clear previous data from table body
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
				
				//make clicking the kandidaadid table rows take "hover" class
				$("#candidateList tr").hover( function() {
				    $(this).toggleClass('hover');
				});
				
				//make the click actually navigate to candidate voting page
				$("#candidateList tr").click( function() {
				    window.location = $(this).find('a').attr('href');
				});
				loadingAnimation("stop")//if JSON request is done, stop animation
			});
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

