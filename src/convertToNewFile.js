var fs = require('fs');
var file1 = require('./cb_2016_40_tract_500k_formatted.json');
var file2 = require('./census_data_oklahoma.json');

function loopOverCensusData() {
  for(var i = 0; i < file2.length; i++) {
    loopOverGeoJSON(file2[i]);
  }
  writeNewFile(file1);
}

function loopOverGeoJSON(properties) {
  for(var i = 0; i < file1.features.length; i++) {
    if(file1.features[i].properties.NAME == properties.census_track_number) {
      file1.features[i].properties = Object.assign(file1.features[i].properties, properties);
    }
  }
}

function writeNewFile(fileData) {
  var tmpStr = JSON.stringify(fileData, null, 2);
  console.log(tmpStr);
  fs.writeFile('cb_2016_census_and_tract_data.json', tmpStr, 'utf-8');
}

loopOverCensusData();
