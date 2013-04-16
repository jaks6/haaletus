$(document).ready(function() {
	
	if(get_cookie("page")=="valimised"){
		var name = get_cookie("data").split(",")[0];
		$("#login").html("");
		$("#login").append("<a href=\"#\" onclick=logOut()>"+name+"</a>");
	}
	

});

function isLoggedIn(){
	if(get_cookie("page")!="valimised"){
		var hash = window.location.hash.substring(1)
		if(hash=="haaletamine"){
			$("#haaletamine").html("");
			$("#content").append("<p>Logige sisse,et j&aumltkata</p>");
		}
		else if(hash=="kandideerimine"){
			$("#kandideerimine").html("");
			$("#content p").html("");
			$("#content").append("<p>Logige sisse,et j&aumltkata</p>");
		}
	}
}


function logOut(){
	document.cookie=("page=\"\";expires=-1;path=/");
	document.cookie=("id=\"\";expires=-1;path=/");
	document.cookie=("votedFor=\"\";expires=-1;path=/");
	document.cookie=("data=\"\";expires=-1;path=/");
	$("#login").html("");
	$("#login").append("<a href=\"\" onclick=logIn()>Logi sisse</a>");
	FB.logout(function(response) {
		window.location = "/";
	});
	console.log("logging out");
	updateMyApp(getLocationHash());

}

function logIn(){
	connectFB();
}

function user(){
	window.location = window.location.hash;
	var name = get_cookie("data").split(",")[0];
	var email = get_cookie("data").split(",")[1];
	var bdate = get_cookie("data").split(",")[2];
	if(get_cookie("data") != ""){
		$("#login").html("");
		$("#login").append("<a href=\"#\" onclick=logOut()>"+name+"</a>");
	}
	
	
	var ID = "";
	$.ajaxSetup({async: false});
	$.get("rest/authenticate",{'name' : name}, function(data) {
		for (var i in data) {
			ID=data;
		}
	});
	
	if(ID=="No_account"){
		var newID = "";
		console.log("User has no account, creating one");
		$.post("rest/authenticate",{'name' : name,'email' : email,'bdate' : bday});
		$.get("rest/authenticate",{'name' : name}, function(data) {
			for (var i in data) {
				newID=data;
			}
			document.cookie=("id="+newID.split(";")[0]+";expires=-1;path=/");
			document.cookie=("cid="+newID.split(";")[1]+";expires=-1;path=/");
			
			updateMyApp(getLocationHash());
		});


	}
	else{
		console.log("Kasutaja eksisteerib ID'ga "+ID.split(";")[0]);
		document.cookie=("id="+ID.split(";")[0]+";expires=-1;path=/");
		document.cookie=("cid="+ID.split(";")[1]+";expires=-1;path=/");
	}
	
}


//Get cookie routine by Shelley Powers 
function get_cookie(Name) {
  var search = Name + "="
  var returnvalue = "";
  if (document.cookie.length > 0) {
    offset = document.cookie.indexOf(search)
    // if cookie exists
    if (offset != -1) { 
      offset += search.length
      // set index of beginning of value
      end = document.cookie.indexOf(";", offset);
      // set index of end of cookie value
      if (end == -1) end = document.cookie.length;
      returnvalue=unescape(document.cookie.substring(offset, end))
      }
   }
  return returnvalue;
}