var logged_in=false;
$(document).ready(function() {
	if(get_cookie("name")=="valimised"){
		$("#login").html("");
		$("#login").append("<a href=\"#\" onclick=logOut()>Sisse logitud</a>");
	}
	

});

function logOut(){
	document.cookie=("name=\"\";expires=-1;path=/");
	document.cookie=("id=\"\";expires=-1;path=/");
	$("#login").html("");
	$("#login").append("<a href=\"#\" onclick=authenticateUser()>Logi Sisse</a>");
}

function authenticateUser(){
	var ID = "";
	$.ajaxSetup({async: false});
	$.get("rest/authenticate", function(data) {
		for (var i in data) {
			ID=data;
		}
	});
	if(ID!="Fail"){
		console.log("Success");
		$("#login").html("");
		$("#login").append("<a href=\"#\" onclick=logOut()>Sisse logitud</a>");
		logged_in=true;
		document.cookie = "name=valimised; expires=0; path=/";
		document.cookie = "id="+ID+"; expires=0; path=/";

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