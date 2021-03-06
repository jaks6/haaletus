$(document).ready(function () {
	tulemusedInit();
});
//!TODO HOVER OVER TABLE IMAGE CHANGES STYLE?


//muutuja kus veergude headerite "hetkestaatust" 
var colHeaders = new Array();		//indeksil i on arv 1 kui veerg on sorditud asc. ; -1 kui desc. ; 0 kui sortimata;
for (var i = 0; i < 6; i++) {	// -1 kui desc. ; 		0 kui sortimata
	colHeaders[i] = 0;			//vaikimisi on k�ik veerud sorteerimata.
}

var lastClickedColumn = 0;

function tulemusedInit() {
	$.getScript("https://www.google.com/jsapi", function (){
	
	$(".sortable th").each(function (index) {
		//add  sorting icon-buttons to HTML table header 
		$(this).append('<a class="sortIcon"><img id="asc' + index + '" src="./images/asc.png">');
		$(this).append('<a class="sortIcon"><img id="desc' + index + '" src="./images/desc.png">');
		$(this).append('<a class="sortIcon"><img id="unsorted' + index + '" src="./images/unsorted.png">');
	});


//	INITIALIZATION AS LAB MATERIALS REQUESTED
	sortColumn("#tulemustabel tr:gt(0)", 0);  //set the left-most column as sorted, as required
	toggleImage(0);
//	END OF INITIALIZATION

	sortColumnOnClick(".sortIcon");
	loadGoogleCharts();
	//$.getScript("scripts/map.js");
	});
}


function loadGoogleCharts() {
	// Load the Visualization API and the piechart package.
	google.load('visualization', '1', {'callback': 'drawChart()', 'packages': ['corechart']});
	// Set a callback to run when the Google Visualization library is loaded.
}

function drawChart() {
	// Create the data table.
	$.getJSON("rest/tulemused", function (jsonData) {
		
		//Store results in localStorage
		localStorage["storage.piechart"] = JSON.stringify(jsonData);
		initNewChart(jsonData);


	}).fail(function () {
		console.log("offline chart drawing"); 
		if ("storage.piechart" in localStorage) {
			var storedData = JSON.parse(localStorage["storage.piechart"]);
			initNewChart(storedData);
		}
	}); //End of json request FAIL function;

}

/** adds new piechart to the html 
\argument argData - the data, formatted according to google's style, with which to draw the chart*/
function initNewChart(argData) {
	var data = new google.visualization.DataTable();
	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('graph'));
	var options = {'title': ' H\u00E4\u00E4lte jagunemine parteides '
	};
	data.addColumn('string', 'Partei');
	data.addColumn('number', 'H��li');
	data.addRows(argData);

	// Set chart options
	chart.draw(data, options);
	loadingAnimation("stop");
}


//this function handles the flow of events when a click is made on a table header.
function sortColumnOnClick(selector) { 		
	$(selector).click(function (event) {

		var colId = event.target.id;				//get img id of clicked col
		var colIndex = parseInt(colId.slice(-1)); 	//get which col (numerically) was clicked (last char of img id)

		sortColumn("#tulemustabel tr:gt(0)", colIndex); //sorts the specified tabel rows in respect to the specified column (colIndex)
		toggleImage(colIndex);

		lastClickedColumn = colIndex;				//store the clicked icon's index in a buffer for future toggleImage function
		return false;
	});
}
//switches the sorting icon-button after a click has been made
function toggleImage(colIndex) {
	if (lastClickedColumn !== undefined) { 	//if this isnt the first column ever clicked
		//reset the last clicked column icon
		$("#asc" + lastClickedColumn + ", #desc" + lastClickedColumn).css({'display': 'none'});
		$("#unsorted" + lastClickedColumn).css({'display': 'inline'});

	}

	$("#unsorted" + colIndex).css({'display': 'none'});	//hide "unsorted" when a col is clicked
	$(getNewId(colIndex)).css({'display': 'inline'});	//show whichever new icon is appropriate

};


//returns which image (as an ID) to display next. refer to "colHeaders" array
function getNewId(colIndex) {
	var images = ["#unsorted", "#asc", "#desc"];

	var newId = images[0];
	if (colHeaders[colIndex] === -1) {
		newId = images[2];
	} else if (colHeaders[colIndex] === 1) {
		newId = images[1];
	}
	return newId + colIndex;
}


function sortColumn(tableSelector, colIndex) {
	//TABLE SORTING inspired by http://onwebdev.blogspot.com/2011/04/jquery-sorting-tables-alphabetically.html
	//reset all other columns except the clicked one.
	for (var i = 0; i < 6; i++) {
		if (i !== colIndex) {
			colHeaders[i] = 0;
		}
	}

	//First, toggle the status of the column (ie. which way it's currently sorted)
	if (colHeaders[colIndex] === 0) {
		colHeaders[colIndex] = 1;					//If it's never been sorted before, make it asc.
	} else {
		colHeaders[colIndex] = -1 * colHeaders[colIndex]; //If the col was sorted before, reverse(toggle) between asc/desc
	}


	// Get all the rows of table, EXCEPT THE FIRST! ( :gt(0) )
	var rows = $(tableSelector).get();	

	//sort the rows using our own sorting function
	rows.sort(function (a, b) {

		//Fetch the uppercase text of the cell
		var A = $(a).children('td').eq(colIndex).text().toUpperCase();
		var B = $(b).children('td').eq(colIndex).text().toUpperCase();

		//check if the number is NOT a valid number
		A = (isNaN(A)) ? A : parseInt(A, 10);
		B = (isNaN(B)) ? B : parseInt(B, 10);

		if (A < B) {
			return colHeaders[colIndex] * -1;	//Multiply the state of the given colHeader by (-1), for reverse sorting to work
		}

		if (A > B) {
			return colHeaders[colIndex] * 1;
		}
		return 0;

	});

	$.each(rows, function (index, row) {					//iga rea puhul:
		$('.sortable').children('tbody').append(row); 	//appendime ta tabeli bodysse
		//Et row on reaalne html element
		//mis on juba dokumendis olemas,
		//siis seda kuhugi appendides, "v�etakse ta vanast kohast �ra".
		//seet�ttu ei ole vaja isegi tabelit enne t�hjaks teha, et 
		//ridu �mber seada.
	});
}