var fs = require('fs');
var promise = require('bluebird');
var file = './location-data.csv';

// first stream in file data
fs.readFile(file, 'utf-8', function(err, data) {
  if(err) {
    console.log('err! ', err);
  }
  parseData(data);
});

// next parse data
function parseData(data) {
  var newtmparr = [];
  var tmpArr = data.split(',,,,,,');
  for(var i = 0; i < tmpArr.length; i++) {
    newtmparr.push(tmpArr[i].split(','));
  }
  for(var j = 0; j < newtmparr.length; j++) {
    for(var k = 0; k < newtmparr[j].length; k++) {
      if(newtmparr[j][k].includes('Census Tract')) {
        console.log('true');
        console.log(newtmparr[j][k]);
        newtmparr[j][k].replace(/[^\d.-]/g, '');
        console.log(newtmparr[j][k]);
      }
    }
  }
}

// lastly stream it into new file
