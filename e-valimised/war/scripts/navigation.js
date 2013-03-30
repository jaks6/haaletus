//this deals with situations of actual page loading (ie hitting f5)
$(document).ready(function(){
	updateMyApp(getLocationHash());
});

/**
 * Flag tells my onhashchange event handler whether my app should be updated
 * whenever hash value changes. Enabled by default. If hash change comes from
 * my app, use this flag to stop my onhashchange event handler from executing.
 * @type boolean
 */
var allowHashToUpdateApp = true;

//an alternative way to load pages.....
// FOR BACK AND FORWARD TO WORK, MIGHT WANT TO LOOK INTO : https://developers.google.com/tv/web/articles/location-hash-navigation
function fetchHtmlContent(filename){
	
	//empty previous content, then reload new content
	$("#content-wrapper").empty();	
	$("#content-wrapper").load(filename+" #content", function() {
		initPageScripts(filename);
		
		
		//make homemenu bigbutton background disappear, reappear on other pages
		//alert("filename: " + filename);
		if (filename=='index.html'){
			$("#content").css('background-color','none');
			$("#content").css('box-shadow','none');
		} else {
			$("#content").css('background-color','#E7E7E7');
			$("#content").css('box-shadow', ' 4px 4px 6px rgba(50, 50, 50, 0.4)');
			
		}
		
	});
	
}

/** Calls scripts specific to the page given in param
 * @param filename - the page whose scripts must be loaded
 */
function initPageScripts(filename){
	if (filename=='tulemused.html'){ 
		callSortTable();
	} else if (filename=='kandidaadid.html'){
		callKandidaadidScript();
	}
}
/**
 * Called to change the state of my app based on specified value.
 */
function updateMyApp(value) {
	console.log("updating app with" + value);
	window.location.hash = value;
	
	fetchHtmlContent(value+".html");
  // Track state by updating location hash
  //setLocationHash('state-N');
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

// - UNUSED, TO BE REMOVED: ?
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
	console.log("in hashchange");
  if (allowHashToUpdateApp) {
    updateMyApp(getLocationHash());
  } else {
    allowHashToUpdateApp = true;
  }
};