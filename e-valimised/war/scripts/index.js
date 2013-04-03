function loadingAnimation(action){
	if (action=="start"){
		$("#content-wrapper").css("opacity", "0.4");
		$("#pic").fadeIn(500);
	} else if (action=="stop"){
		$("#pic").fadeOut(250);
		$("#content-wrapper").css("opacity", "1");
	}
}   