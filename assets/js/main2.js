// the tile layer containing the image generated with `gdal2tiles --leaflet -p raster -w none <img> tiles`
var baselayer = L.tileLayer('./assets/tiles/{z}/{x}/{y}.png', {
  noWrap: true, 
  bounds: bounds,
  attribution: 'Map data &copy; Bethesda Softworks LLC, a ZeniMax Media company. Trademarks belong to their respective owners. All Rights Reserved.<br/>See source at: <a href="https://github.com/dan-parker/YASSM-NW">https://github.com/dan-parker/YASSM-NW</a>'
});


// create the map
var map = L.map('mapid', {
  layers: [baselayer],
  crs: L.CRS.Simple,
  fullscreenControl: false,
  fullscreenControlOptions: {
    position: 'topleft'
  },
  maxBounds: bounds,
  preferCanvas: true,
  renderer: L.canvas({ padding: 5 })
});

var bounds = new L.LatLngBounds(L.latLng(-65, -65),L.latLng(85,65));

var img = [
  3189,  // original width of image
  3040   // original height of image
]

// assign map and image dimensions
var rc = new L.RasterCoords(map, img)
// set max zoom Level (might be `x` if gdal2tiles was called with `-z 0-x` option)
//map.setMaxZoom(rc.zoomLevel())
map.setMinZoom(3)
map.setMaxZoom(5)
// all coordinates need to be unprojected using the `unproject` method
// set the view in the lower right edge of the image
//map.setView(rc.unproject([img[0], img[1]]), 2)
map.setView(rc.unproject([805,975]),4)
//map.fitBounds(bounds);
//map.addLayer(ol_loc);

function RemapCoord(y,x,z){
	//Let's remap and shift
	y=y/2250-102;
	x=x/2250+96.5;
	return [y,x,z]
}

var ciLayer = L.canvasIconLayer({}).addTo(map);

        var i=0;
	var thisIcon = L.icon({iconUrl: 'assets/img/high.png',iconSize: [5, 5],iconAnchor: [8, 8]});
	var iconHigh = L.icon({iconUrl: 'assets/img/high.png',iconSize: [5, 5],iconAnchor: [8, 8],shadowUrl: 'assets/img/shadow.png',shadowSize: [5,5],shadowAnchor:[10,10]});
	var iconMedium = L.icon({iconUrl: 'assets/img/medium.png',iconSize: [3, 3],iconAnchor: [8, 8],shadowUrl: 'assets/img/shadow.png',shadowSize: [5,5],shadowAnchor:[10,10]});
	var iconSmall = L.icon({iconUrl: 'assets/img/small.png',iconSize: [3, 3],iconAnchor: [8, 8],shadowUrl: 'assets/img/shadow.png',shadowSize: [5,5],shadowAnchor:[10,10]});
	var iconTerminal = L.icon({iconUrl: 'assets/img/terminal.png',iconSize: [4, 4],iconAnchor: [8, 8],shadowUrl: 'assets/img/shadow.png',shadowSize: [5,5],shadowAnchor:[10,10]});
	var iconNuke = L.icon({iconUrl: 'assets/img/nuke.png',iconSize: [4, 4],iconAnchor: [8, 8],shadowUrl: 'assets/img/shadow.png',shadowSize: [5,5],shadowAnchor:[10,10]});
	var iconSafe = L.icon({iconUrl: 'assets/img/safe.png',iconSize: [4, 4],iconAnchor: [8, 8],shadowUrl: 'assets/img/shadow.png',shadowSize: [5,5],shadowAnchor:[10,10]});
	var iconPA = L.icon({iconUrl: 'assets/img/pa.png',iconSize: [4, 4],iconAnchor: [8, 8],shadowUrl: 'assets/img/shadow.png',shadowSize: [5,5],shadowAnchor:[10,10]});

	var skip = 0;  
	do {
		switch(true) {
		case (MarkerData[i].name == "High"):
			thisIcon = iconHigh;
			break;
		case (MarkerData[i].name == "Medium"):
			thisIcon = iconMedium;
			break;
		case (MarkerData[i].name == "Low"):
			skip = 1;
			break;
		case (MarkerData[i].name == "Terminal"):
			thisIcon = iconTerminal;
			break;
		case (MarkerData[i].name == "Nuke Briefcase"):
			thisIcon = iconNuke;
			break;
		case (MarkerData[i].name == "Safe"):
			thisIcon = iconSafe;
			break;
		case (MarkerData[i].name == "Power Armor"):
			thisIcon = iconPA;
			break;
		case (MarkerData[i].name == "Bobblehead"):
			skip = 1;
			break;
		case (MarkerData[i].name == "Magazine"):
			skip = 1;
			break;
          	}
		if (skip == 0) {
			//Some markers are outside the play area, let's skip them too
			var loc = RemapCoord(MarkerData[i].y,MarkerData[i].x,0);
			//if (loc[1] > 2 && loc[1] < 255 && loc[0] < 0 && loc[0] > -255) {
				ciLayer.addMarker(L.marker(loc,{icon: thisIcon}));
			//}
		} else {skip=0;}
	    	i++;
	} while (i < MarkerData.length-1);

    var htmlLegend = L.control.htmllegend({
        position: 'topright',
        legends: [{
            name: 'Legend',
            elements: [{
                label: 'Small',
                html: '<img src="assets/img/small.png" height="5" width="5">'
            },
            {
                label: 'Medium',
                html: '<img src="assets/img/medium.png" height="5" width="5">'
            },
            {
                label: 'High',
                html: '<img src="assets/img/high.png" height="5" width="5">'
            },
            {
                label: 'Terminal',
                html: '<img src="assets/img/terminal.png" height="5" width="5">'
            },
            {
                label: 'Briefcase',
                html: '<img src="assets/img/nuke.png" height="5" width="5">'
            },
            {
                label: 'Safe',
                html: '<img src="assets/img/safe.png" height="5" width="5">'
            },
            {
                label: 'Power Armor',
                html: '<img src="assets/img/pa.png" height="5" width="5">'
            },
	]
        }],
        collapseSimple: true,
        detectStretched: true,
        disableVisibilityControls: true
    });
    map.addControl(htmlLegend);

