var fs = require('fs');
var file1 = __dirname + '/cb_2016_40_tract_500k_formatted.json';
var file2 = __dirname + '/census_data_oklahoma.json';
var file1Data;
var file2Data;

function getFileData(file) {
  return fs.readFileSync(file, 'utf-8', function(err, data) {
    if(err) {
      console.log('something terrible happened!');
    } else {
      console.log('else!');
      return data;
    }
  });
}

file1Data = getFileData(file1);
file2Data = getFileData(file2);

function mapData() {
  for(var i = 0; i < file2Data.length; i++) {
    var tmpTract = file2Data[i].census_track_number;
    console.log(tmpTract);
  }
}

console.log(file2Data);

mapData();
