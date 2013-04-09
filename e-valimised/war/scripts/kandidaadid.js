$(document).ready(function(){
	kandidaadidInit();

});


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
	//var fields=getFieldValues();
	
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
				
				
				$('tr').click( function() {
				    window.location = $(this).find('a').attr('href');
				}).hover( function() {
				    $(this).toggleClass('hover');
				});
				loadingAnimation("stop")//if JSON request is done, stop animation
			});
}

//appends a row to a table with specified ID with given args
function appendRow2Table(tableId, name, id, party, region, votes){
	$("#"+tableId).append(
			'<tr><td><a href="#haaletamine?kandidaat='+id+'" onClick="updateMyApp("haaletamine?kandidaat='+id+'") >'+ name +'</a></td>\
			<td>'+ id +'</td>\
			<td>'+ party +'</td>\
			<td>'+ region +'</td>\
			<td>'+ votes +'</td>\
	</tr>');
}


