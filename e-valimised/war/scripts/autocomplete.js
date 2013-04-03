$(document).ready(function() {
	doComplete();
});
<<<<<<< HEAD


function doComplete(){
	var availableTags = [
	                     "ilves",
	                     "mees",
	                     "mõnus",
	                     "mesine"
	                     ];

=======
function doComplete(){	
	
>>>>>>> origin/jakobiBranch
	$( "#nimiFull" ).autocomplete({ 
		source: ( "/rest/autocomplete"),
		
		noResults: '',
		minLength: 2,
        results: function() {},
	
		select: function(e, ui){
        
        // comment out this line to see the difference
        $('#nimiFull').val(ui.item.value);
        contactServlet($("#kandidaadid_form").serialize());}
		});
}



