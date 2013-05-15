var legendInfo = {};
legendInfo.length = 0;

function initialize() {
	console.log("in maps.js initalize");

	var styleArray = [{	//Turn everything gray
		featureType: "all",
		stylers: [{ saturation: -100 }]

	}, { //make province borders pinkish
		featureType: "administrative.province",
		elementType: "geometry.stroke",
		stylers: [{ hue: "#CC3399" },
		          { saturation: 50 },
		          { weight : 2}
		          ]
	}];
	var mapOptions = {	
			center: new google.maps.LatLng(58.651227, 25.147705),
			zoom: 7,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,	//peidame UI
			scrollwheel: false,
			draggable: false
	};
	var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);


	var provinces = [
	                 [59.43040, 24.74366, "Harju"],
	                 [58.37350, 26.71960, "Tartu"],
	                 [58.36309, 25.59465, "Viljandi"],
	                 [58.99160, 22.72400, "Hiiu"],
	                 [59.35830, 27.41300, "Ida-Viru"],
	                 [59.34950, 26.34800, "L‰‰ne-Viru"],
	                 [58.74590, 26.39798, "Jıgeva"],
	                 [58.88590, 25.57170, "J‰rva"],
	                 [58.94680, 23.53160, "L‰‰ne"],
	                 [58.05320, 27.05150, "Pılva"],
	                 [59.00568, 24.79320, "Rapla"],
	                 [58.38319, 24.49648, "P‰rnu"],
	                 [57.77770, 26.03340, "Valga"],
	                 [57.84810, 26.99430, "Vıru"],
	                 [58.25240, 22.48530, "Saare"]
	                 ];



	//include the markerwithlabel / styledMarker script. it is important that this script is loaded after the Maps API
	$.getScript("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/styledmarker/src/StyledMarker.js", function () {
		$.getScript("http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.9/src/infobox_packed.js", function () {
			//Add text next to markers
			setMarkers(map, provinces, addLegend);

		});
	});
	map.setOptions({styles: styleArray});
}

//hetkel kutsutakse loadMapScript v‰lja navigation.js initscripts alt

function loadMapScript() {

	if (typeof google !== 'object' || typeof google.maps !== 'object') {
		console.log('Google Maps API Not loaded yet, loading');
		$.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDoC27Ptu1NJy2sgwkIbOqNCsO_8T7SMjM&sensor=true&callback=initialize", function () {});
	} else {
		console.log('Google Maps already loaded, initializing');
		initialize();
	}

}




function setMarkers(map, locations, callback) {
	$.getJSON("rest/tulemused?region=all", function (jsonData) {
		var jsonLength = jsonData.length;
		var markerSet = [];

		for (var i = 0; i < locations.length; i++) {

			// Add anonymous grey markers to each region
			var location = locations[i];
			var color = "#CCCCCC";
			var styledMarker = new StyledMarker({ 
				styleIcon : new StyledIcon(StyledIconTypes.MARKER, {
					color: color
				}),
				position : new google.maps.LatLng(location[0], location[1]),
				map : map 
			});
			markerSet.push(styledMarker);
		}

		//Add party names to legendInfo list, set name in legendInfo
		for (var j = 0; j < jsonLength; j++) {
			var partyID = jsonData[j][1];
			if (legendInfo[partyID] === undefined) {
				legendInfo.length ++;
				var partyName = jsonData[j][3];
				legendInfo[partyID] =  {"name": partyName};
			}
		}
		//get color for each party
		for (var id in legendInfo) {
			if (id === 'length' || !legendInfo.hasOwnProperty(id)) {
				continue;
			}
			legendInfo[id].color = getColor(id, legendInfo.length);
		}

		// Add coloured markers + infoboxes according to each regions leader
		for (var j = 0; j < jsonLength; j++) {

			//kui erakonna ID'd pole legendInfos, salvestame muutujasse legendInfo partei ID kohale
			//erakonna nimetuse ja talle omistatud v‰rvi
			var partyID = jsonData[j][1];

			//modify existing markers' colors to match party color
			markerSet[jsonData[j][0]-1].styleIcon.set(
					'color', legendInfo[partyID].color);

			//add infobox ( css class : ".info	Box" )
			var location = locations[jsonData[j][0] - 1];
			var percentage = Math.floor(jsonData[j][2] / jsonData[j][5] * 100);
			var infoBoxOptions = {	
					content: percentage + "%",
					disableAutoPan: true,
					pixelOffset: new google.maps.Size(-56, -33),
					position: new google.maps.LatLng(location[0], location[1]),
					closeBoxURL: "", //removes close box
					isHidden: false,
					pane: "mapPane",
					enableEventPropagation: true
			};

			var infoBox = new InfoBox(infoBoxOptions);
			infoBox.open(map);
		}

		//finally draw the Legend.
		callback(map, legendInfo);
		$("button[name='legendToggle']").click(function () {	//make the legend toggleable
			$('#mapLegend').slideToggle();
		});
	});
}

function addLegend(map, legendInfo) {
	var layer = new google.maps.FusionTablesLayer({
		query: {
			select: 'Location',
			from: '1NIVOZxrr-uoXhpWSQH2YJzY5aWhkRZW0bWhfZw'
		},
		map: map
	});

	// Create the legend and display on the map
	var legend = document.createElement('div');
	legend.id = 'mapLegend';
	var content = [];
	content.push('<h3>Legend:</h3>');
	for (var partyID = 1; partyID <= legendInfo.length; partyID++) {
		content.push('<p style="border-left: solid 16px ' + legendInfo[partyID].color + '">&nbsp;' +
				legendInfo[partyID].name +
		'</p>');
	}
	content.push('<p style="border-left: solid 16px #CCCCCC">&nbsp; H&auml;&auml;led puuduvad</p>');

	legend.innerHTML = content.join('');
	legend.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

}

//COLOR WORK 
/** returns a color for a party calculated by partys index and the no. of total regions*/
function getColor(index, totalParties) {

	var step = (1 / totalParties);
	var resultHex = hsvToRgb(((index) * step), 0.7, 1); //saturation =0,7 lightness =1
	console.log("step=" + step + ", val=" + index *  step);
	return resultHex;
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v) {
	var r, g, b;

	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);

	switch (i % 6) {
	case 0: r = v, g = t, b = p; break;
	case 1: r = q, g = v, b = p; break;
	case 2: r = p, g = v, b = t; break;
	case 3: r = p, g = q, b = v; break;
	case 4: r = t, g = p, b = v; break;
	case 5: r = v, g = p, b = q; break;
	}

	return rgbToHex(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255));
}
//END OF COLOR WORK
