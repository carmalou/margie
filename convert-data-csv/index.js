var fs = require('fs');
var promise = require('bluebird');
var file = './location-data.csv';

// first stream in file data
fs.readFile(file, 'utf-8', function(err, data) {
  if(err) {
    console.log('err! ', err);
  }
  var tmparr = parseData(data);
  var finalpiece = convertToCsv(tmparr);
  fs.writeFile('location-data-formatted.csv', finalpiece, function(err) {
    if(err) {
      console.log('something terrible has happened! ', err);
    }
  })
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

  return newtmparr;
}

// convert array to csv
function convertToCsv(arr) {
  for(var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].join(',');
  }
  arr = arr.join('\n');
  return arr;
}
