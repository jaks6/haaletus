$(document).ready(function() {
	doComplete();
});
function doComplete(){
	var availableTags = [
	                     "ilves",
	                     "mees",
	                     "m�nus",
	                     "mesine"
	                     ];

	$( "#nimiFull" ).autocomplete({ 
		source: availableTags,
		noResults: '',
        results: function() {}
		});
}



