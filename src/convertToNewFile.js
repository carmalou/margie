var fs = require('fs');
var file1 = require(__dirname + '/cb_2016_40_tract_500k_formatted.json');
var file2 = require(__dirname + '/census_data_oklahoma.json');

function loopOverCensusData() {
  for(var i = 0; i < file2.length; i++) {
    loopOverGeoJSON(file2[i]);
  }
}

function loopOverGeoJSON(properties) {
  for(var i = 0; i < file1.features.length; i++) {
    if(file1.features[i].properties.NAME == properties.census_track_number) {
      for(var key in properties) {
        file1.features[i].properties[key.toUpperCase()] = properties[key];
      }
    }
  }
  writeNewFile(file1);
}

function writeNewFile(fileData) {
  var tmpStr = JSON.stringify(fileData);
  fs.writeFile('cb_2016_census_and_tract_data.json', tmpStr, 'utf-8');
}

loopOverCensusData();
