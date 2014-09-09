"use strict";

var Q  = require('q'),
    mysql = require('mysql'),
    config = require('config'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    db = require('../database.js'),
    geocoder = require('node-geocoder').getGeocoder('google', 'https', {apiKey:config.google.appApiKey}),
    geocoder2 = require('node-geocoder').getGeocoder('nominatimmapquest', 'http'),
    Spreadsheet = require('edit-google-spreadsheet');

module.exports = exports = {
  adminSheet: function(req, res, next) {
    var sheet = req.params.action;
    var sheets = {
      'facts': {
        sheetId: 'od6',
        descField: 1,
        columnDef: ['description', 'detail', 'published']
      },
      'voices': {
        sheetId: 'op3qyu',
        descField: 3,
        columnDef: ['title', 'detail', 'description', 'published']
      },
      'offenders': {
        sheetId: 'ognp1n8',
        descField: 3,
        columnDef: ['detail', 'title', 'description', 'published']
      },
    }
    var count = 0;

    var fetchSheet = function(sheet) {
      var sheetInfo = sheets[sheet];
      var deferred = Q.defer();

      db.doQuery("drop table if exists content_tmp").then(function() {
        db.doQuery("create table content_tmp like content").then(function() {
          Spreadsheet.load({
            //debug: true,
            spreadsheetId: config.google.contentSheetId,
            worksheetId:sheetInfo.sheetId,
            oauth : {
              email: config.google.email,
              key: config.google.oauthKey,
            }
          }, function sheetReady(err, spreadsheet) {
            if (err) {
              deferred.reject(err);
            }
            spreadsheet.receive(function(err, rows, info) {
              if (err) {
                deferred.reject(err);
              }
              var promises = [];
              Object.keys(rows).forEach(function(r) { 
                var row = rows[r];
                if (r == 1) { return; }
                if (row[sheetInfo.descField] == undefined) { return; }
                var itemDeferred = Q.defer();
                promises.push(itemDeferred.promise);
                var item = {type: sheet};
                sheetInfo.columnDef.forEach(function(field, i) { 
                  if (sheet == 'offenders' && field == 'title') { return; }
                  if (field == 'published') { 
                    item[field] = row[i+1] == 'Published' ? 1 : 0;
                  } else {
                    item[field] = row[i+1];
                  }
                })
                db.doQuery("insert into content_tmp set ?", item).then(function() {
                  count++;
                  itemDeferred.resolve();
                }, deferred.reject);
              })  
              Q.all(promises).then(function() { 
                db.doQuery("delete from content where type = ?", sheet).then(function() {
                  db.doQuery("insert into content select * from content_tmp").then(function() {
                    db.doQuery("drop table content_tmp").then(function() {
                      db.doQuery("update content a join candidates b on voteSmartId = detail set title = nameFirstLast where type = 'offenders'").then(function() {
                        deferred.resolve();
                      }, deferred.reject);
                    }, deferred.reject);
                  }, deferred.reject);
                }, deferred.reject);
              }, deferred.reject);
            });
          });
        }, deferred.reject);
      }, deferred.reject);
      return deferred.promise;
    }

    if (! sheets[sheet]) {
      next(new Error("Invalid sheet ("+sheet+")"))
    } else {
      fetchSheet(sheet).then(function() {
        res.send({type: 'admin', data: count}) 
      }, function(err) { 
        db.doQuery("drop table id exists content_tmp").then(function() {
          next(err);
        },next);
      });
    }
  },

  adminMap: function(req, res, next) {
    var actionType = req.params.action;
    var count = 0;
    var layers = {
      'campus': 'https://www.google.com/maps/ms?dg=feature&ie=UTF8&authuser=0&msa=0&output=kml&msid=212809903200638764816.0004ffe8cc6d60dc02d24',
      'assets': 'https://maps.google.com/maps/ms?dg=feature&ie=UTF8&authuser=0&msa=0&output=kml&msid=208766254594228440027.0004d61d0323693e5957b',
    }
    var states = {};

    if (! layers[actionType]) {
      next(new Error("Invalid action"));
    }
    db.doQuery('select * from states').then(function(data){
      data.forEach(function(state) {
        states[state.state_name.toLowerCase()] = state.state;
      });

      db.doQuery('drop table if exists koch_assets_tmp').then(function() {
        db.doQuery('create table koch_assets_tmp like koch_assets').then(function() {
          db.deferredRequest(layers[actionType]).then(function(data) { 
            var promises = [];
            var results = [];
            if (data && data.kml && data.kml.Document[0].Placemark[0]) {
              var assets = data.kml.Document[0].Placemark;
              //var assets = [data.kml.Document[0].Placemark[0]];
              assets.forEach(function(c, i) {
                if (! c.Point || ! c.Point[0]) {return; } //No point, no keep

                var deferred = Q.defer();
                promises.push(deferred.promise)
                var coords = c.Point[0].coordinates[0].split(',');
                var asset = {
                  title: c.name[0],
                  layer: actionType,
                  lat: coords[1],
                  lng: coords[0],
                  description: c.description || ''
                }
                setTimeout(function() {
                  geocode(geocoder, asset).then(
                    function(res) { 
                      asset = res;
                    }, 
                    function(err) {
                      console.log('geocoding error - falling to 2nd geocoder');
                      console.log(err);
                      geocode(geocoder2, asset).then(
                        function(res) { 
                          asset = res;
                        }, function(err) {
                          console.log('geocoding error: '+err)
                          deferred.reject(new Error("There was an error with the Geocoder. Most likely we have reached our daily rate limit. Try again tomorrow?"));
                        }
                      );
                    }
                  ).then(function() {
                    db.doQuery("insert into koch_assets_tmp set ?", asset).then(function(){
                      count++;
                      deferred.resolve();
                    }, error)
                  });
                }, 200*i);
              });
            }
            Q.all(promises).then(function() {
              db.doQuery('delete from koch_assets where layer = ?', actionType).then(function(){
                db.doQuery("insert into koch_assets select * from koch_assets_tmp").then(function() {
                  db.doQuery('drop table if exists koch_assets_tmp').then(function() {
                    res.send({type: 'admin', data: count}) 
                  }, error)
                }, error)
              }, error)
            }, error)
          },next)
        },next)
      },next)
    },next)

    var geocode = function(geocodeUtil, asset) {
      var deferred = Q.defer();
      try {
        geocodeUtil.reverse(asset.lat, asset.lng, function(err, location) {
          if (! err && location[0]) {
            asset.city = location[0].city;
            if (location[0].state == 'penna') {
              asset.state = 'PA';
            } else {
              asset.state = states[location[0].state.toLowerCase()];
            }
            asset.zipcode = location[0].zipcode;
            asset.country = location[0].countryCode;
            if (!asset.state && asset.country == 'us') {
              console.log("can't get state");
              console.log(location);
            }
            deferred.resolve(asset);
          } else {
            deferred.reject(err);
          }
        });
      } catch (e) {
        deferred.reject(e);
      }

      return deferred.promise;
    };

    var error = function(err) { 
      console.log(err)
      db.doQuery('drop table if exists koch_assets_tmp').then(function() {
        next(err);  
      }, next)
    }
  }

};