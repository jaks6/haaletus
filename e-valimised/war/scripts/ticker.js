var tWidth  =  '800px';                  // width (in pixels)
var tHeight  =  '25px';                  // height (in pixels)
var tcolour  =  'gray';               // background colour:
var moStop  =  true;                     // pause on mouseover (true or false)
var fontfamily  =  'Abel,Times New Roman'; // font for content
var tSpeed  =  3;                        // scroll speed (1  =  slow, 5  =  fast)

// enter your ticker content here (use \/ and \' in place of / and ' respectively)
var content  =  '  TOP 5: ';

// Simple Marquee / Ticker Script
// copyright 3rd January 2006, Stephen Chapman
// permission to use this Javascript on your web page is granted
// provided that all of the below code in this script (including this
// comment) is used without any alteration

var cps = tSpeed; 
var aw, mq; 
var fsz = parseInt(tHeight) - 4; 

function fetchTopThree() {
	var name, id, region, party, votes, i = 1;
	$.ajaxSetup({async: false});
	$.getJSON("rest/jerseyshore", function (data) {
		for (var candidate in data) {
			name  =  data[candidate].name;
			id  =  data[candidate].id;
			region  =  data[candidate].region;
			party  =  data[candidate].party;
			votes  = data[candidate].votes;
			content = content + "--- " + i + ". " + name + " { " + votes + " } ---";
			i = i + 1;
		}
		
	});
}

function startticker() {
	fetchTopThree();
	if (document.getElementById) {

				var tick  =  '<div style = "\
			margin:0px auto;\
			position:relative;\
			width:'+tWidth+';\
			height:'+tHeight+';\
			overflow:hidden;\
			background-color:'+tcolour+'"'; 
		
		if (moStop) tick += ' onmouseover = "cps = 0" onmouseout = "cps = tSpeed"'; 
		
		tick += '><div id = "mq" style = "\
			position:absolute;\
			left:0px;\
			top:0px;\
			font-family:'+fontfamily+';\
			font-size:'+fsz+'px;\
			white-space:nowrap;\
			"><\/div><\/div>'; 
		
		document.getElementById('ticker').innerHTML  =  tick;
		mq = document.getElementById("mq"); 
		mq.style.left = (parseInt(tWidth)+10)+"px"; 
		mq.innerHTML = '<span id = "tx">' + content + '<\/span>'; 
		aw = document.getElementById("tx").offsetWidth; 
		lefttime = setInterval("scrollticker()", 30);
		}
	} 

function scrollticker() {
			mq.style.left = (parseInt(mq.style.left)>(-10 - aw)) ?parseInt(mq.style.left)-cps + "px" : parseInt(tWidth) + 10 + "px";
		} 
window.onload = startticker;
                  