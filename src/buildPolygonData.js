var fs = require('fs');
var file1 = require('./cb_2016_census_and_tract_data');
var turf = require('turf');
var turf_centerOfMass = require('@turf/center-of-mass');
var turf_area = require('@turf/area');
var tmpArr = [];

// first we build out an obj with the stuff we want
// namely, the census tract number && coordinates for the polygon
for(var i = 0; i < file1.features.length; i++) {
  var tmpObj = {
    name: file1.features[i].properties.NAME,
    coordinates: file1.features[i].geometry.coordinates
  };

  tmpArr.push(tmpObj);
}

// next we will use turf to get the center of each polygon && the area
// centerOfMass == an array of long/lat
// area == area of polygon in square meters
for(var j = 0; j < tmpArr.length; j++) {
  var turfPolygon = turf.polygon(tmpArr[j].coordinates);
  var tmpPolygon = turf_centerOfMass(turfPolygon);
  var tmpArea = turf_area(turfPolygon);

  tmpArr[j].centerOfMass = tmpPolygon.geometry.coordinates;
  tmpArr[j].area = Math.floor(tmpArea);
}

// lastly we will write this to a new file to use for the Google Places API

fs.writeFileSync('GooglePlacesInfo.json', JSON.stringify(tmpArr, null, 2), 'utf-8');
