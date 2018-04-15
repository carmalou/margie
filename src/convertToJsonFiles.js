var fs = require('fs');
var csv = require('csv-parser');

var censusArr = fs.readdirSync('../data/census_tracts');
var tmpJson = [];

function parseCSV() {
    fs.createReadStream('../data/M-Z_aff_download (2)/ACS_16_5YR_S2001_with_ann.csv')
        .pipe(csv())
        .on('data', function (data) {
            tmpJson.push(data);
        })
        .on('end', function() {
            console.log(tmpJson);
            fs.writeFileSync('../data/M-Z_feature_data.json', JSON.stringify(tmpJson));
    })
}

parseCSV();