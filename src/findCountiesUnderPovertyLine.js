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
        var returnArr = [];

        returnArr = responseArr.filter(function(county) {
            // return parseInt(county.number_of_households) > 2714 && parseInt(county.number_of_households) < 3471;
            return parseInt(county.stateId) == 22;
        });

        return returnArr;
    })
    .then(function(low10) {
        var polygonsArr = [];
        low10.forEach(function(countyIncome) {
            counties.features.forEach(function(county) {
                if(county.properties.GEOID == countyIncome.Id2) {
                    var tmpObj = {};
                    tmpObj.GeoId = countyIncome.GeoId;
                    tmpObj.Geography = countyIncome.Geography;
                    tmpObj.state = countyIncome.state;
                    tmpObj.stateId = countyIncome.stateId;
                    tmpObj.countyId = countyIncome.countyId;
                    tmpObj.median_income = countyIncome.median_income;
                    tmpObj.number_of_households = countyIncome.number_of_households;
                    county.properties.countyData = tmpObj;
                    polygonsArr.push(county);
                }
            })
        });

        polygonsArr = polygonsArr.filter(function(polygon) {
            return polygon != undefined;
        });

        polygonsArr.forEach(function(polygon) {
            var ptsWithin = pointsWithinPolygon(libraries, polygon);
            polygon.properties.libraries = ptsWithin.features.length;
        });

        var writeArr = [];

        polygonsArr.forEach(function(feature) {
            writeArr.push(feature.properties);
        });

        var newArr = writeArr.reduce(function(arr, current) {
            current.countyData.libraries = current.libraries;
            arr.push(current.countyData);
            return arr;
        }, []);

        newArr.sort(function(a, b) {
            return a.libraries - b.libraries;
        });

        var totalLibs = newArr.reduce(function(num, current) {
            num += current.libraries;
            return num;
        }, 0);

        console.log('Total libraries: ', totalLibs);
        console.log('Number of counties: ', newArr.length);

        fs.writeFileSync('./../data/louisana-counties.json', JSON.stringify(newArr, null, 2), { encoding: 'utf-8' });
    });
}

readInData();