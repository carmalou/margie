var fs = require('fs');
var _ = require('lodash');

var censusArr = fs.readdirSync('../data/census_tracts');
var tmpIncome1 = JSON.parse(fs.readFileSync('../data/A-L_feature_data.json').toString());
var tmpIncome2 = JSON.parse(fs.readFileSync('../data/M-Z_feature_data.json').toString());

var incomeData = [].concat(tmpIncome1, tmpIncome2);

incomeData = incomeData.map(function(row) {
    for(var prop in row) {
        if(prop == 'GEO.id2') {
            row[prop] = _.padStart(row[prop], 11, '0');
        }
        else if(!Number.isNaN(Number(row[prop]))) {
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
        var tmpObj = {}
        if(incomeData[tmp.features[j].properties.GEOID]) {
            tmpObj.median_income1 = incomeData[tmp.features[j].properties.GEOID].HC01_EST_VC02;
            tmpObj.median_income1_margin_of_error = incomeData[tmp.features[j].properties.GEOID].HC01_MOE_VC02;
            tmpObj.median_income2 = incomeData[tmp.features[j].properties.GEOID].HC01_EST_VC15;
            tmpObj.median_income2_margin_of_error = incomeData[tmp.features[j].properties.GEOID].HC01_MOE_VC15;
            tmpObj.mean_income = incomeData[tmp.features[j].properties.GEOID].HC01_EST_VC16;
            tmpObj.mean_income_margin_of_error = incomeData[tmp.features[j].properties.GEOID].HC01_MOE_VC16;
            tmpObj.geoid1 = incomeData[tmp.features[j].properties.GEOID]['GEO.id'];
            tmpObj.geoid2 = incomeData[tmp.features[j].properties.GEOID]['GEO.id2'];
        }
        
        tmp.features[j].properties = Object.assign(tmp.features[j].properties, tmpObj);
    }
    fs.writeFileSync('../data/master_data/master_'+ censusArr[i], JSON.stringify(tmp));
}