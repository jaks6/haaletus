$(document).ready(function() {
	doComplete();
});
function doComplete(){
	var availableTags = [
	                     "ilves",
	                     "mees",
	                     "mõnus",
	                     "mesine"
	                     ];

	$( "#nimiFull" ).autocomplete({ 
		source: availableTags,
		noResults: '',
        results: function() {}
		});
}



