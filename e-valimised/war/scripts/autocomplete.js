$(document).ready(function() {
	doComplete();
});

function doComplete(){	
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



