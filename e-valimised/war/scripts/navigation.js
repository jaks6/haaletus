//an alternative way to load pages.....

function fetchHtmlContent(filename){
	alert("IN fetch, filename:" + filename);
	$("#content-wrapper").empty();
	$("#content-wrapper").load(filename+" #content");
	
	$("#content").css('background-color','#E7E7E7');
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
