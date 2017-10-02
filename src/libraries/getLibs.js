var fs = require('fs');
var turf = require('turf');
var uniqBy = require('lodash.uniqby');
var lib1 = require('./libraries1.json');
var lib2 = require('./libraries2.json');
var lib3 = require('./libraries3.json');
var tmpArr = [];

function combineArrs(tmp) {
  for(var i = 0; i < tmp.length; i++) {
    tmpArr.push(tmp[i]);
  }
}

combineArrs(lib1);
combineArrs(lib2);
combineArrs(lib3);

var newArr = uniqBy(tmpArr, "id");

fs.writeFileSync('OklahomaLibsList.json', JSON.stringify(newArr, null, 2), 'utf-8');
