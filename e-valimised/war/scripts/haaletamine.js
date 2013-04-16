//$(document).ready(function(){
////	haaletamineInit();
//});


function haaletamineInit(){
//	console.log("haalteamine init, cookei ="+get_cookie("id"));
//	if (get_cookie("id")!= "\"\""){
//		$("#haaletamine").css('display','block');
//		$("#haaletamine_refused").css('display','none');
//	} else {
//		console.log("MUSTVE BEEN EMPT COOKY");
//		$("#haaletamine").css('display','none');
//	}
	
	
}


function getVote(){
	
	//Check if current user has voted
	var uID = get_cookie("id");
	var ownerID = ""
	$.ajaxSetup({async: false});
	$.get("/rest/haaletamine",{'id' : uID}, function(data) {                            
		for (var i in data) {
			ownerID=data;
		}
	});
	
	
	//If user has voted, check who has the vote
	var vote = ""
	if(ownerID!="NoVote"){
		document.cookie=("votedFor="+ownerID+";expires=-1;path=/");
			$.get("/rest/candidate",{ 'kandidaat' : ownerID},function(data){
				for (var i in data) {
					vote=vote+data[i];
					if(data.length != i){
						vote=vote+", ";
					}
				}
			});
	}
	return vote;
}

function postVote(haaleAndja, haaleSaaja){
	$("[name='voteButton']").click(function(){
			
			var eelmineHaal = get_cookie("votedFor");
			var cID = get_cookie("cid");
			
			if(eelmineHaal=="" || eelmineHaal=="\"\""){
				eelmineHaal=0;
			}
			
			console.log("PostVote "+haaleAndja+" "+haaleSaaja+" "+eelmineHaal);
			if(haaleSaaja==eelmineHaal){
				alert("Te ei saa sama kandidaadi poolt uuesti haaletada");
			}
			else if(haaleSaaja==cID){
				alert("Te ei saa enda poolt haaletada");
			}
			else{
				$.post("/rest/haaletamine",{'uid' : haaleAndja,'kid' : haaleSaaja, 'votedFor' : eelmineHaal});
				window.location = "/";
			}
		
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
							"<br><div id='button_style'>" +
							"<button type='button' name='voteButton' >H&auml;&auml;leta!</button> " +
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
	console.log("Contactservlet id on: "+id);
	postVote(get_cookie("id"), id); // 1. param = h‰‰letaja, 2. param = h‰‰le saaja
}

////appends a row to a table with specified ID with given args


