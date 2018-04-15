var fs = require('fs');
var _ = require('lodash');
var csv = require('csv-parser');

var censusArr = fs.readdirSync('../data/census_tracts');
var tmpIncome1 = JSON.parse(fs.readFileSync('../data/A-L_feature_data.json').toString());
var tmpIncome2 = JSON.parse(fs.readFileSync('../data/M-Z_feature_data.json').toString());

var incomeData = [].concat(tmpIncome1, tmpIncome2);

incomeData = incomeData.map(function(row) {
    for(var prop in row) {
        if(!Number.isNaN(Number(row[prop]))) {
            row[prop] = Number(row[prop]);
        }
    }
    return row;
});

incomeData = _.keyBy(incomeData, 'GEO.id2');

for(var i = 0; i < censusArr.length; i++) {
    var tmp = fs.readFileSync('../data/census_tracts/' + censusArr[i]).toString();
    tmp = JSON.parse(tmp);
    for(var j = 0; j < tmp.features.length; j++) {
        tmp.features[j].properties = Object.assign(tmp.features[j].properties, incomeData[tmp.features[j].properties.GEOID])
    }
    console.log(tmp.features[1].properties);
    fs.writeFileSync('../data/master_data/master_'+ censusArr[i], JSON.stringify(tmp));
}