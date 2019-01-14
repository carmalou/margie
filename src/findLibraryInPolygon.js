var pointsWithinPolygon = require('@turf/points-within-polygon');
var libraries = require('./../data/library_data/US_libraries.json');
var counties = require('./../data/us-counties-2010.json');
var geoId = process.argv[2];

var myCounty = counties.features.find(function(county) {
    return county.properties.GEO_ID == geoId;
});

var ptsWithin = pointsWithinPolygon(libraries, myCounty);

console.log("There are " + ptsWithin.features.length + " libraries in " + myCounty.properties.NAME + " county.");