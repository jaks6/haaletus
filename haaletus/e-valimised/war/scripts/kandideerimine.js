//returns false if we have invalid field (and highlights them)
//returns true if field are filled, and pops up confirmation window
function submitEvents(){
	if (validateForm()){
		kinnitaKandideerimine();
		return true;
	} else {
		return false;
	}
}


function validateForm(){
        $("#kandideerimise_vorm span").remove();
        var fields_empty=false;
        var fields = new Array();
        $(':input').each(function() {
                fields.push($(this).val());
        });
        for(var i=0;i<4;i++){
                if(fields[i] == ''){
                        var fields_empty=true;
                        $(":input").eq(i).css("background-color","#FFD6D6");
                        $(":input").eq(i).after("<span>Palun t&auml;itke v&auml;li!</span");
                }
                else{
                        $(":input").eq(i).css("background-color","white");
                }
        }
        if(fields_empty){
                return false;
               
        }
        return true;
}






//function which pops up a confirmation when "submit" is clicked
function kinnitaKandideerimine(){

        var r=confirm("Kinnitage kandideerimine.");
        if (r==true)
          {alert("Olete lisatud kandidatuuri!")}
}
