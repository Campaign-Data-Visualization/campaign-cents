"use strict";


var Q  = require('q'),
    config = require('config'),
    exec = require('child_process').exec,
    db = require('../server/database.js'),

var promises = [];

var count = 0;
db.doQuery("select * from states").then(function(data) {
	data.forEach(function(state) { 
    count++;
    console.log(state.state);
    var deferred = Q.defer();
    promises.push(deferred.promise);
    setTimeout(function() { 
      db.deferredRequest("http://maps.googleapis.com/maps/api/geocode/json?components=administrative_area:"+state.state).then(function(res) { 
        var geo = res.results[0].geometry;
        var info = {
          center_lat: geo.location.lat,
          center_lng: geo.location.lng,
          ne_lat: geo.viewport.northeast.lat,
          ne_lng: geo.viewport.northeast.lng,
          sw_lat: geo.viewport.southwest.lat,
          sw_lng: geo.viewport.southwest.lng,
        }
        db.doQuery("update states set ? where state = ?", [info, state.state]).then(function () {
          console.log("done with "+state.state);         
          deferred.resolve();
        }, error);
      }, error)
    }, count*200);
  });
  Q.all(promises).done(function() {
    db.exit();
  });
});

var error = function(err) { 
  console.log(err);
}
