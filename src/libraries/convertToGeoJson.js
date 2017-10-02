var fs = require('fs');
var libsList = require('./OklahomaLibsList.json');

var geoJsonObj = {
  "type": "FeatureCollection",
  "features": []
};

for(var i = 0; i < libsList.length; i++) {
  var tmpObj = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
        parseFloat(libsList[i].lng),
        parseFloat(libsList[i].lat)
      ]
    },
    "properties": {
      "ID": libsList[i].id,
      "libName": libsList[i].store,
      "address": libsList[i].address,
      "city": libsList[i].city,
      "state": libsList[i].state,
      "zip": libsList[i].zip,
      "country": libsList[i].country,
      "phone": libsList[i].phone,
      "url": libsList[i].url
    }
  }
  geoJsonObj.features.push(tmpObj);
}

fs.writeFileSync('OK_Lib_GeoJson.json', JSON.stringify(geoJsonObj, null, 2), 'utf-8');
