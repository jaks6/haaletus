//NAVIGATION INSPIRED BY : https://developers.google.com/tv/web/articles/location-hash-navigation
//!TODO: START USING /#! hashbangs!


//this deals with situations of actual page loading (ie hitting f5)
$(document).ready(function(){
	allowHashToUpdateApp = false;
	updateMyApp(getLocationHash());
});

/**
 * Flag tells my onhashchange event handler whether my app should be updated
 * whenever hash value changes. Enabled by default. If hash change comes from
 * my app, use this flag to stop my onhashchange event handler from executing.
 * @type boolean
 */
var allowHashToUpdateApp = true;

function fetchHtmlContent(hashName, subpageName, queryString){
	//empty previous content, then reload new content
	$("#content-wrapper").empty();	
	$("#content-wrapper").load(hashName+".html #content", function() {
		//Load subpage:
		if (subpageName!=""){
			loadStatisticSubpage(subpageName);
		}
		
		//make homemenu bigbutton background disappear, reappear on other pages
		if (hashName=='index'){
			$("#content").css('background-color','none');
			$("#content").css('box-shadow','none');
		
		}
		else if (hashName=='haaletamine'){
			isLoggedIn();
			$("#content").css('background-color','#E7E7E7');
			$("#content").css('box-shadow', ' 4px 4px 6px rgba(50, 50, 50, 0.4)');
		}
		else if (hashName=='kandideerimine'){
			isLoggedIn();
			$("#content").css('background-color','#E7E7E7');
			$("#content").css('box-shadow', ' 4px 4px 6px rgba(50, 50, 50, 0.4)');
		}
		else {
			$("#content").css('background-color','#E7E7E7');
			$("#content").css('box-shadow', ' 4px 4px 6px rgba(50, 50, 50, 0.4)');

		}

		initPageScripts(hashName, queryString);
	});

}

function loadStatisticSubpage(hashName){
	//empty previous content, then reload new content
	//event.preventDefault();
	
	//initPageScripts(hashName);
	$("#piirkonniti").css('display', 'none');
	$("#riigis").css('display', 'none');
	$("#parteidekaupa").css('display', 'none');
	
	$("#"+hashName).css('display','block');
	setLocationHash("tulemused/"+hashName);
	

	
}

/** Calls scripts, queries specific to the page given in param
 * @param hashName - the page whose scripts must be loaded
 *  @param queryString - the query to be passed, if there is one
 */
function initPageScripts(hashName, queryString){
	loadingAnimation("start");

	var queryFlag = false;
	if (queryString!=""){
		queryFlag = true; // set the flag, so that we know that we should also make the queries
	}
	
    $.getScript("scripts/"+ hashName +".js", function(){
    	if (queryFlag){
    		contactServlet(queryString);
    	}
    	loadingAnimation("stop");

    }); 
	

}
/**
 * Called to change the state of my app based on specified value.
 */
function updateMyApp(value) {
	var hashName;
	var queryString ="";
	var questionMarkPos = value.indexOf('?');
	var slashPos = value.indexOf('/');
	var subpageName ="";
	
	

	
	if (questionMarkPos != -1 &&  slashPos!= -1){
		hashName = value.substring(0, slashPos);
		subpageName = value.substring( slashPos +1, questionMarkPos);
		queryString = value.substring( questionMarkPos +1); // see osa, mis järngeb ?-le
	}
	else if (questionMarkPos != -1){ //kui leidub queryString, siis eraldame selle
		hashName = value.substring(0, questionMarkPos); // see osa stringist, mis eelneb ?-le
		queryString = value.substring( questionMarkPos +1); // see osa, mis järngeb ?-le
		
	} else if (slashPos!= -1) {
		hashName = value.substring(0, slashPos);
		subpageName = value.substring( slashPos +1);
	}
	else {
		hashName = value;	//kui ? pole, järelikult pole ka queryStringi urlis.
	}

	window.location.hash = value;
//	console.log("hashName= "+ hashName);
//	console.log("subPage= " + subpageName);
//	console.log("queryString= " + queryString);
	fetchHtmlContent(hashName, subpageName, queryString);
	
	if (slashPos != -1){	//erilahendus tulemuste lehele, võiks üldisema variandi kunagi kirjutada
		//loadStatisticSubpage(subpageName);
	}
	allowHashToUpdateApp = false;

}


/**
 * Returns the value of the location hash.
 * @return {string} Hash value with '#' prefix discarded.
 */
function getLocationHash () {
	var locHash = window.location.hash.substring(1);
	if (locHash.length == 0) { //if were loading the homepage without any hash, set the hash to #index
		return "index";
	} else {

	}
	return locHash;
}

/**
 * Called by my app to update location hash. Hash changes made through
 * this function should always be ignored by the hash change event handler.
 */
function setLocationHash(str) {
	// Tell the event handler to ignore this change since its manually updated.
	allowHashToUpdateApp = false;
	window.location.hash = str;
}

/**
 * Listen for hash changes. Use flag to determine whether hash changes should
 * propagate updates to my app.
 */
window.onhashchange = function(e) {
	if (allowHashToUpdateApp) {
		updateMyApp(getLocationHash());
		allowHashToUpdateApp = true;
	} else {
		allowHashToUpdateApp = true;
	}
};