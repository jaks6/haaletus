
$(document).ready(function(){
	
	$("#kandidaadid_form").on('submit',function(){	//when the submit button ("OTSI") is pressed...
		
		  $("#content").css("opacity", "0.4");
		  $("#pic").fadeIn(500);
		  $("#pic").fadeOut(500);
		   
		   $('#content')
			  .delay(1000)
			  .queue( function(next){ 
			    $(this).css('opacity','1'); 
			    next(); 
			  });
			  
		setTimeout(function(){
    	 
		//Conditions to check which file to load.
		if ($("select[name=Partei]").val()!== "allPartys"){
			if ($("select[name=Piirkond]").val()!== "allAreas"){
				getCandidates('data/candidatesByRegionAndParty.json', 	//both region and party have been specified
						$("select[name=Piirkond]").val(), $("select[name=Partei]").val());
				
			} else {
				getCandidates('data/candidatesByParty.json', 			//just party has been specified
						undefined, $("select[name=Partei]").val());
			}
		} else {
			if ($("select[name=Piirkond]").val()!== "allAreas"){
				getCandidates('data/candidatesByRegion.json', 			//just region has been specified
						$("select[name=Piirkond]").val(), undefined);
			}
		}
		
		}, 1000);

		/*----------------------------------------------------implemented for DEBUGGING
		//Iterate over input fields (Name id)
		$("input[type=text]").each(function(index) {	//each() on jQuery for loop, 
			//index annab tsükli parasjagu i väärtuse (0,1,..)
			console.log( index + ": " + $(this).val() );	
			//võtame form fieldilt tema praeguse value ning prindime konsoolis.
		});
		*/
		
		/*----------------------------------------------------implemented for DEBUGGING
		//Iterate over dropdown menus (party & region)
		$("select").each(function(index) {	
			console.log( index + ": " + $(this).val() );	
	
		});*/
		
		
		return false; 	//needed for AJAX .submit() stuff to work properly. without this line clicking
						//SUBMIT will refresh the entire page.
	});
	
});

//fetches data from a predestined .json file, outputs it to the table with the id "candidateList"
function getCandidates(filename, region, party){
	
	$("#candidateList > tbody").remove();	//clear previous data from table body
	
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
            
            $("#candidateList").append(
            		'<tr>	<td>'+ name +'</td>\
            		<td>'+ id +'</td>\
            		<td>'+ party +'</td>\
            		<td>'+ region +'</td>\
            		<td>'+ "X" +'</td>\
            		</tr>');
        });
    });
}
   