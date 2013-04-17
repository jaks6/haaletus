//localStorage["storage.largestId"]="0";

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}




function addCandidate2Storage (storageNo, id, name, region, party, votes){
//	localStorage["storage.candidates."+storageNo+".id"] = id;	
	localStorage["storage.candidates."+storageNo+".name"] = name;
	localStorage["storage.candidates."+storageNo+".region"] = region;
	localStorage["storage.candidates."+storageNo+".party"] = party;
	localStorage["storage.candidates."+storageNo+".votes"] = votes;
	
	//increase largest stored ID value
	
	if (! "storage.largestId" in localStorage){localStorage["storage.largestId"]="0";}
	var largestId = parseInt(localStorage["storage.largestId"]);
	if (largestId < parseInt(id)){
		localStorage["storage.largestId"]=id;
	}
}