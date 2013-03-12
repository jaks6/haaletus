var colHeaders=new Array();		//indeksil i on arv 1 kui veerg on sorditud asc. ; -1 kui desc. ; 0 kui sortimata
for ( var i = 0; i< 6; i++){
	colHeaders[i]=0;		//vaikimisi on kõik veerud sorteerimata.
}
$(document).ready(function() {
	
	$(".sortable th").each(function(index) {
			//add sorting images to HTML header portion
		   $(this).append('<a class="sortImg"><img id="'+ index+'" src="./images/sort.gif">')
		});
	
	sortColumnOnClick(".sortImg"); // !TODO should this be done with listeners instead??????

});

function sortColumnOnClick(selector){
	//TABLE SORTING inspired by http://onwebdev.blogspot.com/2011/04/jquery-sorting-tables-alphabetically.html

	$(selector).click(function(event) {
		var colIndex = event.target.id; //get which col was clicked
		
		//First, toggle the status of the column (ie. which way it's currently sorted)
		if (colHeaders[colIndex] == 0){ 
			colHeaders[colIndex] = 1;					//If it's never been sorted before, make it asc.
		} else {
			colHeaders[colIndex] = -1*colHeaders[colIndex]; //If the col was sorted before, reverse(toggle) between asc/desc
		}
		
		
		
		
		// Get all the rows of table, EXCEPT THE FIRST! ( :gt(0) )
		var rows = $("#tulemustabel tr:gt(0)").get();	
		//

		//sort the rows using our own sorting function
		rows.sort(function(a, b) {

			//Fetch the uppercase text of the cell
			var A = $(a).children('td').eq(colIndex).text().toUpperCase();
			var B = $(b).children('td').eq(colIndex).text().toUpperCase();
			
			//check if the number is NOT a valid number
			A = (isNaN(A)) ? A : parseInt(A);
			B = (isNaN(B)) ? B : parseInt(B);

			if (A < B) {
				return colHeaders[colIndex] * -1;	// !TODO explain why we have -1 and 1 in the return statements
			}

			if (A > B) {
				return colHeaders[colIndex] * 1;
			}
			return 0;

		});

		$.each(rows, function(index, row) {					//iga rea puhul:
			$('.sortable').children('tbody').append(row); 	//appendime ta tabeli bodysse
			//Et row on reaalne html element
			//mis on juba dokumendis olemas,
			//siis seda kuhugi appendides, "võetakse ta vanast kohast ära".
			//seetõttu ei ole vaja isegi tabelit enne tühjaks teha, et 
			//ridu ümber seada.
		});


		return false;
	});
	
}