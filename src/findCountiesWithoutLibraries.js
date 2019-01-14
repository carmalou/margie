var fs = require('fs');
var pointsWithinPolygon = require('@turf/points-within-polygon');
var libraries = require('./../data/library_data/US_libraries.json');
// var counties = require('./../data/tl_2017_us_county.json');
const csv = require('csvtojson');
var csvFilePath = '../data/2017-data/median-income-past-12-months/ACS_17_5YR_S1903_with_ann_formatted.csv';
var tracking = [];

fs.readFile('./../data/tl_2017_us_county.json', 'utf-8', function(err, counties) {
    if(err) {
        throw err;
    } else {
        counties = JSON.parse(counties);

        console.log('counties pre-filter ', counties.features.length);

        counties.features = counties.features.filter(function(feature) {
            var badCodes = ['72', '78', '60', '64', '66', '68', '69', '70'];
            return !badCodes.includes(feature.properties.STATEFP);
        });

        console.log('parsed! ', counties.features.length);
        counties.features.forEach(function(county, i) {
            console.log('foreach! ', i);
            var ptsWithin = pointsWithinPolygon(libraries, county);
            var tmpCounty = {
                'libraries': ptsWithin.features.length,
                'GeoId': county.properties.GEOID,
                'county': county.properties.COUNTYFP,
                'state': county.properties.STATEFP,
                'niceName': county.properties.NAMELSAD
            };
            tracking.push(tmpCounty);
        });

        console.log('past points within');
        
        var noLibCounties = tracking.filter(function(county) {
            return county.libraries == 0;
        });

        console.log('filtered again!');

        console.log('length ', noLibCounties.length);
        
        // readInData(noLibCounties);

        fs.writeFileSync('./../data/counties-without-libraries3.json', JSON.stringify(noLibCounties, null, 2), { encoding: 'utf-8' });
    }
});

function readInData(noLibCounties) {
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        console.log('then!')
        var returnArr = [];
        jsonObj.forEach(function(obj) {
            var ids = obj.Id.split('US')[1];
            var stateId = ids.slice(0,2);
            var countyId = ids.slice(2);

            // console.log('stateId ', stateId, 'countyId ', countyId, 'ids ', ids);

            var tmpObj = {};
            var tmpState = obj.Geography.split(', ')[1];
            tmpObj.Id2 = obj.Id2;
            tmpObj.Geography = obj.Geography;
            tmpObj.state = tmpState;
            tmpObj.stateId = stateId;
            tmpObj.countyId = countyId;
            tmpObj.median_income = obj.Median_income_in_dollars;
            tmpObj.number_of_households = obj.Number_of_Estimate_Households;
            returnArr.push(tmpObj);
        });
        return returnArr;
    })
    .then(function(responseArr) {
        console.log('second then!');
        var noLibArr = [];

        noLibCounties.forEach(function(county) {
            console.log(county);
            noLibArr.push(responseArr.find(function(obj) {
                return obj.Id2 == county.GeoId;
            }));
        });

        noLibArr = noLibArr.filter(function(county) {
            return county != undefined;
        });

        console.log(noLibArr.length);
    });
}