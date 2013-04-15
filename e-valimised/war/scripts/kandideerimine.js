$(document).ready(function(){
	kandideerimineInit();

});


function kandideerimineInit(){
	getDropdownOptions("region", "party");
	$("#kandideerimise_vorm").on('submit',function(){
		submitEvents();

		return false;
	});
}

function createKandidaat(){
	var uID = get_cookie("id");
	var partys = $("select[name=party] option");
	var regions= $("select[name=region] option");
	var region_id = regions.index(regions.filter(":selected"));
	var party_id = partys.index(partys.filter(":selected"));
	console.log(party_id+" "+region_id+" "+uID);
	$.post("rest/Kandideerimine",{ 'uID' :  uID , 'party' : party_id, 'region' : region_id});
	
}
function submitEvents(){
		
	if (validateForm()){ //used to be validateForm()
		kinnitaKandideerimine();
		return false;
	} else {
		return false;
	}
}


//returns false if we have invalid field (and highlights them)
//returns true if field are filled, and pops up confirmation window
function validateForm(){
        $("#kandideerimise_vorm span").remove();
        var fields_empty=false;
        var fields = new Array();
        var symbols = ["!","<",">","#","%","@"];
        $(':input').each(function() {
                fields.push($(this).val());
        });
        for(var i=0;i<2;i++){
                if(fields[i] == ''){
                        fields_empty=true;
                        $(":input").eq(i).css("background-color","#FFD6D6");
                        $(":input").eq(i).after("<span>Palun t&auml;itke v&auml;li!</span");
                        
                }
              	
                else{
                    for(var j=0;j<symbols.length;j++){
                   	 if(fields[i].indexOf(symbols[j]) !== -1 && i!=2){
                        	fields_empty=true;
                        	$(":input").eq(i).css("background-color","#FFD6D6");
                        	$(":input").eq(i).after("<span>Ei tohi sisaldada s&uumlmboleid!</span");
                        	break;
                     }
                   	 else{
                   		 $(":input").eq(i).css("background-color","white");
                   	 }
                   	 
                   }
                }
        }
        if(fields_empty){
                return false;
               
        }
        return true;
}






//function which pops up a confirmation when "submit" is clicked
function kinnitaKandideerimine(){
		if(get_cookie("cid")==""){ //If user isn't candidate
			if (confirm("Kinnitage kandideerimine.")==true){
				alert("Olete lisatud kandidatuuri!")
				createKandidaat();
			}
		}
		else{
			alert("Te ei saa uuesti kandideerida");
		}
}
