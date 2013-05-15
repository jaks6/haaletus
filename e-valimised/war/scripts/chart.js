// Callback that creates and populates a data table, 
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
	// Create the data table.
	var data = new google.visualization.DataTable();

	data.addColumn('string', 'Partei');
	data.addColumn('number', 'H‰‰l');
	data.addRows([
	    ['6nne erakond', 3],
	    ['Heade M6tete erakond', 5],
	    ['Asjatundjate erakond', 3], 
	    ['Loote erakond', 2]
	]);

	// Set chart options
	var options = {'title': 'Tulemused parteide kaupa.',
			'width': 400,
			'height': 300};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById("googlechart"));
	console.log("Creating new google pie chart");
	chart.draw(data, options);
}
