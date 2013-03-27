//an alternative way to load pages.....

function fetchHtmlContent(filename){
	//alert("IN fetch, filename:" + filename);
	$("#content-wrapper").empty();
	$("#content-wrapper").load(filename+" #content", function() {
		if (filename=='tulemused.html'){ 
			callSortTable();
		} else if (filename=='kandidaadid.html'){
			callKandidaadidScript();
		}
		
		
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


function display(newDiv){
    if(newDiv.id == "homemenu"){
            $("#content").css('background','none');
            $("#content").css('box-shadow','none');
    }
    else{
            $("#content").css('background-color','#EFEFEF');
    }

   $(newDiv).siblings().hide();
   $(newDiv).show();
  

}

function PRINT(){
	console.log("HELLO WORLD");
}
