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

  if(newtmparr[newtmparr.length - 1] == '') {
    newtmparr.pop();
  }

  for(var j = 0; j < newtmparr.length; j++) {
    for(var k = 0; k < newtmparr[j].length; k++) {
      if(newtmparr[j][k].includes('Census Tract')) {
        newtmparr[j][k] = newtmparr[j][k].replace(/[^\d.-]/g, '');
      }
      if(newtmparr[j][k].includes('County')) {
        newtmparr[j][k] = newtmparr[j][k].replace(/\s|["']|County/g, '');
      }
      newtmparr[j][k] = newtmparr[j][k].replace(/\s|["']/g, '');
    }
  }

  newtmparr.unshift(['Census Track', 'County', 'State']);
  console.log(newtmparr);
}

// lastly stream it into new file
