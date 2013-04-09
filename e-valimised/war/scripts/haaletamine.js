$(document).ready(function(){
	haaletamineInit();

});


function haaletamineInit(){
	console.log("haalteamine init, cookei ="+get_cookie("id"));
	if (get_cookie("id")!= "\"\""){
		$("#haaletamine").css('display','block');
		$("#haaletamine_refused").css('display','none');
	} else {
		console.log("MUSTVE BEEN EMPT COOKY");
		$("#haaletamine").css('display','none');
	}
	
	
}

function isLogged(page){
	if(get_cookie("name")=="valimised"){
		return true;
	}
	else{
		if(page="kand"){
			$("#kandideerimine").html("Peate sisse logima, et kandideerida");
		}
		if(page="haal"){
			$("#haaletamine").html("Peate sisse logima, et hjeeletada");
			$("#k_inputs").html("");
			$("#button_style").html("");
		}
		return false;
	}
}

function getVote(){
	var uID = get_cookie("id");
	var kID = "5" //mingi usvaline kandidaadid ID
	
	$.post("/rest/haaletamine",{'uid' : uID,'kid' : kID});
}

function postVote(haaleAndja, haaleSaaja){
	$("#voteButton").click(function(){
			$.post("/rest/haaletamine",{'uid' : haaleAndja,'kid' : haaleSaaja}
					).done(function() { alert("H‰‰letatud!"); })
					.fail(function() { alert("Ilmnes viga! :S "); })
			return false;
		});
	
}

function contactServlet(query){
	var id = -1;
	if (get_cookie("id")!="\"\""){
		$.getJSON('/rest/candidate?' + query,
				function(data) {
					var name = data.name;
					id = data.id;
					var region = data.region;
					var party = data.party;
					var votes =data.votes;
			
			
					$("#haaletamine").css('display','block');
					$("#haaletamine").html("<p>Kinnitage, et soovite just antud kandidaadi poolt h&auml;&auml;letada:</p>" +
							"(Teie eelnev h&auml;&auml;lt t&uuml;histatakse!)" +
						"<div id='candidate_info'></div>" +
							"<div id='button_style'>" +
							"<br> <input type='button' id='voteButton' value='H&auml;&auml;leta!'>" +
							"</div>");
					
					$("#haaletamine_refused").css('display','none');
					$("#candidate_info").append(
			
							"<ul>" +
							" <li>id: "+ id +"</li>" +
							"<li>Nimi: "+ name +"</li>" +
							"<li>Piirkond: "+ region +"</li>" +
							"<li>Partei: "+ party +"</li>" +
							"<li>H&auml;&auml;li: "+ votes +"</li>" +
							"</ul>" 
					);
		}
		
		);
	}
	postVote(get_cookie("id"), id); // 1. param = h‰‰letaja, 2. param = h‰‰le saaja
}

////appends a row to a table with specified ID with given args


