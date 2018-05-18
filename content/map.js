  mapboxgl.accessToken = 'pk.eyJ1IjoicXVlZW5jYXJtZW4iLCJhIjoiY2o3eXh2d2o5NjRkdzJ3dDY5YW82enNjNCJ9.jb4hQ2e52YiayA7zUTF5VQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/queencarmen/cjg1jifo3000i2roc2vgpcjgs',
    zoom: 8,
    center: [-97.5164, 35.4676],
  });

  map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
  }));

  var libPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

  var legend = document.getElementById('legend');
  var legendInfo = document.getElementById('legend-info');
  var arrOfIds = ["master-tl-2016-01-tract", "master-tl-2016-02-tract", "master-tl-2016-03-tract", "master-tl-2016-04-tract", "master-tl-2016-05-tract", "master-tl-2016-06-tract", "master-tl-2016-07-tract", "master-tl-2016-08-tract", "master-tl-2016-09-tract", "master-tl-2016-10-tract", "master-tl-2016-11-tract", "master-tl-2016-12-tract", "master-tl-2016-13-tract", "master-tl-2016-14-tract", "master-tl-2016-15-tract", "master-tl-2016-16-tract", "master-tl-2016-17-tract", "master-tl-2016-18-tract", "master-tl-2016-19-tract", "master-tl-2016-20-tract", "master-tl-2016-21-tract", "master-tl-2016-22-tract", "master-tl-2016-23-tract", "master-tl-2016-24-tract", "master-tl-2016-25-tract", "master-tl-2016-26-tract", "master-tl-2016-27-tract", "master-tl-2016-28-tract", "master-tl-2016-29-tract", "master-tl-2016-30-tract", "master-tl-2016-31-tract", "master-tl-2016-32-tract", "master-tl-2016-33-tract", "master-tl-2016-34-tract", "master-tl-2016-35-tract", "master-tl-2016-36-tract", "master-tl-2016-37-tract", "master-tl-2016-38-tract", "master-tl-2016-39-tract", "master-tl-2016-40-tract", "master-tl-2016-41-tract", "master-tl-2016-42-tract", "master-tl-2016-43-tract", "master-tl-2016-44-tract", "master-tl-2016-45-tract", "master-tl-2016-46-tract", "master-tl-2016-47-tract", "master-tl-2016-48-tract", "master-tl-2016-49-tract", "master-tl-2016-50-tract", "master-tl-2016-51-tract", "master-tl-2016-52-tract", "master-tl-2016-53-tract", "master-tl-2016-54-tract", "master-tl-2016-55-tract", "master-tl-2016-56-tract", "us-libraries-7dnfzr"];
  var stops =  [
    [5000, "#023858"],
    [10000, "#045a8d"],
    [15000, "#0570b0"],
    [20000, "#3690c0"],
    [25000, "#74a9cf"],
    [30000, "#a6bddb"],
    [35000, "#d0d1e6"],
    [40000, "#fff7fb"],
    [45000, "#f7f4f9"],
    [50000, "#e7e1ef"],
    [55000, "#d4b9da"],
    [60000, "#c994c7"],
    [65000, "#df65b0"],
    [70000, "#e7298a"],
    [75000, "#ce1256"],
    [80000, "#980043"],
    [85000, "#67001f"]
  ];

  function buildOutMessage(e) {
    if(isNaN(e.features[0].properties.median_income1)) {
      return "No income data available for this tract."
    } else {
      return "The median individual income for census tract " + e.features[0].properties.NAME + " is $" + e.features[0].properties.median_income1 + ".";
    }
  }

  function buildLibMessage(e) {
    return (e.features[0].properties.library_name ? e.features[0].properties.library_name.toLowerCase() : '') + " located at " + (e.features[0].properties.location_address ? e.features[0].properties.location_address.toLowerCase() : '') + "<br />" + (e.features[0].properties.location_city ? e.features[0].properties.location_city.toLowerCase() : '') + ", " + (e.features[0].properties.location_state ? e.features[0].properties.location_state.toLowerCase() : '');
  }

  function addEvents(tmpId) {
    map.on('mouseenter', tmpId, function(e) {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', tmpId, function() {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', tmpId, function(e) {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(buildOutMessage(e))
        .addTo(map);
    });

    if(tmpId == 'us-libraries-7dnfzr') {
      map.on('mouseenter', tmpId, function(e) {
        libPopup = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(buildLibMessage(e))
          .addTo(map);
      });

      map.on('mouseleave', tmpId, function() {
        map.getCanvas().style.cursor = '';
        libPopup.remove();
      });
    }
  }

  for(var i = 0; i < arrOfIds.length; i++) {
    addEvents(arrOfIds[i]);
  }

  function generateLegend() {
    for (var i = 0; i < stops.length; i++) {
        var stop = stops[i];
        var parent = document.createElement('div');
        var myDiv = document.createElement('div');
        myDiv.classList.add('legend-box');
        myDiv.style.backgroundColor = stop[1];

        if(stop[0] != 85000) {
          myDiv.setAttribute('data-info', 'Income between $' + (stop[0] - 4999) + ' and $' + stop[0]);
        } else {
          myDiv.setAttribute('data-info', 'Income up to and over $' + stop[0]);
        }
        parent.appendChild(myDiv);
        legend.appendChild(parent);

        myDiv.addEventListener('mouseenter', legendEventListenerText);
        myDiv.addEventListener('mouseleave', legendEventListenerRemoveText);
    }
  }

  function legendEventListenerText(e) {
    legendInfo.style.visibility = 'visible';
    legendInfo.innerHTML = e.target.getAttribute('data-info');
  }

  function legendEventListenerRemoveText(e) {
    legendInfo.style.visibility = 'hidden';
    legendInfo.innerHTML = '';
  }

  generateLegend();