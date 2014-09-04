"use strict";

var Q  = require('q'),
    mysql = require('mysql'),
    config = require('config'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    db = require('../database.js');

module.exports = exports = {
  search: function(req, res, next) { 
    var value = req.params.value;
    var limit = 8;
    console.log('Searching for '+value);

    if (isNaN(value)) {
      value = value.replace(/\.|\,/g, ' ');
      value = value.replace(/ /g, "%");

      db.doQuery("select voteSmartId as id, state, nameLastFirst as label, photoURL as image, concat(state, if(district, concat('-', district), '')) as detail, 'c' as type from candidates where nameSearch like ? limit "+limit, ['%'+value+'%']).then(function(results) { 
        res.send({type:'candidates', data:results});
      });
    } else { 
      db.doQuery("select zip as id, state, zip as label, concat(city, ', ', state) as detail, 'z' as type from zipcode where zip like ? limit "+limit, [value+'%']).then(function(results) { 
        res.send({type:'zips', data:results});
      });
    }
  },

  lookupZip: function(req, res, next) { 
    var zipcode = req.params.zipcode;

    db.deferredRequest({url: "http://congress.api.sunlightfoundation.com/districts/locate?apikey="+config.sunlight.apiKey+"&zip="+zipcode}).then(function(data) { 
      if (data.results && data.count) { 
        var districts = [];
        var state = '';
        data.results.forEach(function(district) { 
          state = district.state;
          districts.push(district.district);
        });

        db.doQuery("select * from candidates where state = ? and (office = 'U.S. Senate' or district in (?)) order by district", [state, districts]).then(function(results) {
          res.send({type:'zip', data: results});
          //console.log(results);
        }, next);

      } else { 
        next(new Error("Invalid Zipcode"));
      }
    }, next);

  },

  lookupCandidateBio: function(req, res, next) { 
    var candidateId = req.params.candidateId;

    db.deferredRequest({url: 'http://api.votesmart.org/CandidateBio.getBio?key='+ config.votesmart.apiKey +'&candidateId='+ candidateId}).then(function(data) {
      if (! data.error) { 
        res.send({type: 'candidateBio', data: data});
      } else {
        next(new Error("Invalid Candidate ID"));
      }
    }, next);
  },

  lookupCandidate: function(req, res, next) {
    var candidateId = req.params.candidateId;

    db.doQuery("select * from candidates where voteSmartId = ?", [candidateId]).then(function(data) {
      res.send({type: 'candidateProfile', data:data[0]})
    }, next);
  },

  lookupMapData: function(req, res, next) { 
    var mapType = req.params.mapType;
    var results = {type:'markers', data: {}};
    if (mapType == 'candidates') {
      db.doQuery("select voteSmartId as id, nameFirstLast as title, format(since2000contrib, 0) as amount, lat, lng from candidates where since2000contrib != 0 and lat != 0 and lng != 0").then(function(data) {
        results.data = data;
        res.send(results);
      })
    }
  }
};

