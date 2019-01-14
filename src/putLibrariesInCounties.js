var pointsWithinPolygon = require('@turf/points-within-polygon');
var libraries = require('./../data/library_data/US_libraries.json');
var counties = require('./../data/us-counties-2010.json');
var tracking = [];

counties.features.forEach(function(county) {
    var ptsWithin = pointsWithinPolygon(libraries, county);
    var tmpCounty = {
        'libraries': ptsWithin.features.length,
        'geoId': county.properties.GEO_ID,
        'county': county.properties.NAME,
        'state': county.properties.STATE
    };
    tracking.push(tmpCounty);
});

tracking.sort(function(a, b) {
    return a.libraries - b.libraries;
});

tracking = tracking.filter(function(county) {
    return county.state != 72;
});

// var noLibCounties = [];
// tracking.forEach(function(county) {
//     if(county.libraries == 0) {
//         noLibCounties.push(county);
//     }
// });

// console.log('There are ' + noLibCounties.length + ' counties without libraries.');

// console.log('County with least libraries:');
// console.log(JSON.stringify(tracking[1], null, 2));

// console.log('County with most libraries:');
// console.log(JSON.stringify(tracking[tracking.length - 1], null, 2));

// tracking.forEach(function(county) {
//     if(county.libraries == 1) {
//         console.log(JSON.stringify(county, null, 2));
//     }
// });