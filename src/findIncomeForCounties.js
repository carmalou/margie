const csv = require('csvtojson');
var fs = require('fs');
function readInData() {
    var noLibCounties = require('./../data/counties-without-libraries3.json');
    console.log('nolib length: ', noLibCounties.length);
    var csvFilePath = './../data/2017-data/median-income-past-12-months/ACS_17_5YR_S1903_with_ann_formatted.csv';
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
            tmpObj.Id2 = obj.Id2;
            tmpObj.Geography = obj.Geography;
            tmpObj.state = tmpState;
            tmpObj.stateId = stateId;
            tmpObj.countyId = countyId;
            tmpObj.median_income = obj.Median_income_in_dollars;
            tmpObj.number_of_households = obj.Number_of_Estimate_Households;

            if(tmpObj.Id2.length != 5) {
                tmpObj.Id2 = '0' + tmpObj.Id2;
            }

            returnArr.push(tmpObj);
        });
        return returnArr;
    })
    .then(function(responseArr) {
        var noLibArr = [];

        noLibCounties.forEach(function(county) {
            noLibArr.push(responseArr.find(function(obj) {
                return obj.Id2 == county.GeoId;
            }));
        });

        noLibArr = noLibArr.filter(function(county) {
            return county != undefined;
        });

        noLibArr.sort(function(a, b) {
            return a.number_of_households - b.number_of_households;
        });

        fs.writeFileSync('./../data/counties-without-libraries3-data.json', JSON.stringify(noLibArr, null, 2), { encoding: 'utf-8' });
    });
}

readInData();