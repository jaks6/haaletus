function loadingAnimation(action) {
	if (action === "start") {
		$("#content-wrapper").css("opacity", "0.4");
		$("#pic").fadeIn(100);
	} else if (action === "stop") {
		$("#pic").fadeOut(150);
		$("#content-wrapper").css("opacity", "1");
	}
}

//Fetches parties and regions from DB, used to fill form "select" type input options

function getDropdownOptions(regionFieldName, partyFieldName) {
	
	$.getJSON('/rest/partiesandregions', function (data) {
		for (var region in data[0]) {
			$("select[name=" + regionFieldName + "]").append('<option value="' + data[0][region] + '">' + data[0][region] + '</option>');
		}
		for (var party in data[1]) {
			$("select[name=" + partyFieldName + "]").append('<option value="' + data[1][party] + '">' + data[1][party] + '</option>');
		}
	});
}