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
        columnDef: ['description', 'detail', 'published'],
        table: 'content'
      },
      'voices': {
        sheetId: 'op3qyu',
        descField: 3,
        columnDef: ['title', 'detail', 'description', 'image', 'published'],
        table: 'content'
      },
      'offenders': {
        sheetId: 'ognp1n8',
        descField: 3,
        columnDef: ['detail', 'null', 'description', 'published'],
        table: 'content'
      },
      'realtime': {
        sheetId: 'oek222k',
        descField: 3,
        columnDef: ['voteSmartId', 'null', 'amount', 'date', 'donor_name', 'published'],
        table: 'realtime_contribs'
      },
      'races': {
        sheetId: 'ooogrp6',
        descField: 2,
        columnDef: ['title', 'description', 'published'],
        table: 'content'
      },
    }
    var count = 0;
    var dataChanged = 0;

    var fetchSheet = function(sheet) {
      var sheetInfo = sheets[sheet];
      var table = sheetInfo.table;
      var deferred = Q.defer();
      sheetInfo.type = sheet == 'realtime' ? 'source' : 'type';

      Spreadsheet.load({
          //debug: true,
          spreadsheetId: config.google.contentSheetId,
          worksheetId:sheetInfo.sheetId,
          useCellTextValues: false,
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
              if (r != 1) {
                var row =  rows[r];
                promises.push(processRow(row, r, sheetInfo));
              }
            })  
            Q.all(promises)
              .then(function() { return Q.fcall(function() { 
                dataChanged = 1;
              })})
              .then(function() { return db.doQuery("delete from "+table+" where "+sheetInfo.type+" = ?", sheet); })
              .then(function() { return db.doQuery("insert into "+table+" select * from "+table+"_tmp"); })
              .then(function() { return db.doQuery("drop table "+table+"_tmp"); })
              .then(function() {
                  var cleanupDeferred = Q.defer();
                  if (sheet == 'offenders') {
                    db.doQuery("update content a join candidates b on voteSmartId = detail set title = nameFirstLast where type = 'offenders'").then(function() {
                      cleanupDeferred.resolve();
                    }, cleanupDeferred.reject);
                  } else if (sheet == 'realtime') {
                    var update = require("./update_candidate_profiles.js");
                    db.doQuery("update realtime_contribs a join koch_orgs b on donor_name = org_name set koch_tier = tier where koch_tier is null")
                      .then(function() { return update.updateCandidates(); })
                      .then(function() {
                        cleanupDeferred.resolve();   
                      })
                      .fail(cleanupDeferred.reject);
                  } else {
                    cleanupDeferred.resolve();   
                  }
                return cleanupDeferred.promise
              })
              .then(function() {
                deferred.resolve();
              })
              .catch(function(err) {
                deferred.reject(err);
              });
          });
        }
      );
      return deferred.promise;
    }

    var setupTmpTable = function(table) {
      var deferred = Q.defer();
      db.doQuery("drop table if exists "+table+"_tmp")
        .then(function() { return db.doQuery("create table "+table+"_tmp like "+table); })
        .then(deferred.resolve)
        .catch(deferred.reject)
      return deferred.promise;
    }

    var processRow = function(row, r, sheetInfo) {
      var itemDeferred = Q.defer();
      var table = sheetInfo.table;
      var type = sheetInfo.type;
      if (r == 1 || row[sheetInfo.descField] == undefined) { 
        itemDeferred.resolve();
      }
      var item = {};
      item[type] = sheet;

      var publish = 0;
      sheetInfo.columnDef.forEach(function(field, i) { 
        if (field == 'null') { return; }
        if (field == 'published') { 
          publish = row[i+1] == 'Published' ? 1 : 0;
          if (table == 'content') {
            item[field] = publish;
          }
        } else {
          item[field] = row[i+1];
        }
      })
      if (publish) {
        if (sheet == 'realtime') { 
          item['cycle'] = 2014;
          var dates = item.date.split("/");
          item.date = dates[2]+"/"+dates[0]+"/"+dates[1];
        }
        db.doQuery("insert into "+table+"_tmp set ?", item).then(function() {
          count++;
          itemDeferred.resolve();
        }, itemDeferred.reject);
      } else {
        itemDeferred.resolve();
      }
      return itemDeferred.promise;
    }


    if (! sheets[sheet]) {
      next(new Error("Invalid sheet ("+sheet+")"))
    } else {
      var sheetInfo = sheets[sheet];
      setupTmpTable(sheetInfo.table)
        .then(function() { return fetchSheet(sheet); })
        .then(function() {
          res.send({type: 'admin', data: count}) 
        })      
        .catch(function(err){
          var message = dataChanged == 1 ? "<b>Data was changed</b>" : "Data was not changed";
          err.message += "<br/>"+message;
          db.doQuery("drop table if exists "+sheetInfo.table+"_tmp").then(function() {
            next(err);
          },next);
        })
    }
  },

  adminMap: function(req, res, next) {
    res.setTimeout(0);
    var actionType = req.params.action;
    var count = 0;
    var layers = {
      // 'campus': 'https://www.google.com/maps/ms?dg=feature&ie=UTF8&authuser=0&msa=0&output=kml&msid=212809903200638764816.0004ffe8cc6d60dc02d24',
      // 'assets': 'https://maps.google.com/maps/ms?dg=feature&ie=UTF8&authuser=0&msa=0&output=kml&msid=208766254594228440027.0004d61d0323693e5957b',
      'assets': '210733691135073649242.0004c583afbfcf4ba47d5',
      'action': '211945913763035895899.000503665332903ce00a0',
      'campus': '212809903200638764816.0004ffe8cc6d60dc02d24',
    }
    var states = {};

    if (! layers[actionType]) {
      next(new Error("Invalid action"));
    }
    db.doQuery('select * from states').then(function(data){
      data.forEach(function(state) {
        states[state.state_name.toLowerCase()] = state.state;
      });

      db.doQuery('drop table if exists koch_assets_tmp')
        .then( function() { return db.doQuery('create table koch_assets_tmp like koch_assets'); })
        .then( function() { return db.deferredRequest('https://maps.google.com/maps/ms?dg=feature&ie=UTF8&authuser=0&msa=0&output=kml&msid='+layers[actionType]); })
        .then( function(data) {
          var promises = [];
          var results = [];
          if (data && data.kml && data.kml.Document[0].Placemark[0]) {
            var assets = data.kml.Document[0].Placemark;
            assets.forEach(function(c, i) {
              var promise = processItem(c, i);
              promises.push(promise);
            });
          }
          Q.all(promises)
            .then(function() { return db.doQuery('delete from koch_assets where layer = ?', actionType); })
            .then(function() { return db.doQuery("insert into koch_assets select * from koch_assets_tmp"); })
            .then(function() { return db.doQuery('drop table if exists koch_assets_tmp'); })
            .then(function() {
              res.send({type: 'admin', data: count})
            })
            .catch(function(err) {
              deferred.reject(err);
            });
        })
        .catch(next);
    }, next);
    
    var processItem = function(c, i) {
      var deferred = Q.defer();
      if (! c.Point || ! c.Point[0]) {
        deferred.resolve();//No point, no keep
      } else {
        var coords = c.Point[0].coordinates[0].split(',');
        var asset = {
          title: c.name[0],
          layer: actionType,
          lat: coords[1],
          lng: coords[0],
          description: c.description || ''
        }
        if(! asset.lat || !asset.lng) {
          deferred.resolve();
        } else { 
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
              }, function(err) {
                deferred.reject(err);
              })
            });
          }, 300*i);
        }
      }
      return deferred.promise;
    }

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