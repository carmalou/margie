var fs = require('fs');
var pointsWithinPolygon = require('@turf/points-within-polygon');
var libraries = require('./../data/library_data/US_libraries.json');
var counties = require('./../data/tl_2017_us_county.json');
const csv = require('csvtojson');
var csvFilePath = '../data/2017-data/median-income-past-12-months/ACS_17_5YR_S1903_with_ann_formatted.csv';

function readInData() {
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        var returnArr = [];
        jsonObj.forEach(function(obj) {
            var ids = obj.Id.split('US')[1];
            var stateId = ids.slice(0,2);
            var countyId = ids.slice(2);
            var tmpObj = {};
            var tmpState = obj.Geography.split(', ')[1];
            tmpObj.GeoId = obj.Id;
            tmpObj.Geography = obj.Geography;
            tmpObj.state = tmpState;
            tmpObj.stateId = stateId;
            tmpObj.countyId = countyId;
            tmpObj.median_income = obj.Median_income_in_dollars;
            tmpObj.number_of_households = obj.Number_of_Estimate_Households;

            if(obj.Id2.length != 5) {
                tmpObj.Id2 = '0' + obj.Id2;
            } else {
                tmpObj.Id2 = obj.Id2;
            }

            returnArr.push(tmpObj);
        });
        return returnArr;
    })
    .then(function(responseArr) {
        responseArr.sort(function(a, b) {
            return b.median_income - a.median_income;
        });

        return responseArr.slice(0,12);
    })
    .then(function(low10) {
        // console.log('low10 ', low10);
        var polygonsArr = [];
        low10.forEach(function(countyIncome) {
            polygonsArr.push(counties.features.find(function(county) {
                // if(countyIncome.Geography == 'Greene County, Alabama') {
                //     console.log('county ', county, ' countyIncome ', countyIncome);
                // }
                return county.properties.GEOID == countyIncome.Id2;
            }));
        });

        // console.log(polygonsArr);

        polygonsArr = polygonsArr.filter(function(polygon) {
            return polygon != undefined;
        });

        polygonsArr.forEach(function(polygon) {
            var ptsWithin = pointsWithinPolygon(libraries, polygon);
            console.log("There are " + ptsWithin.features.length + " libraries in " + polygon.properties.NAMELSAD + ".");
        });
    });
}

readInData();