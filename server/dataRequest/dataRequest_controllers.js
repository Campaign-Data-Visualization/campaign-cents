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
      db.doQuery("select voteSmartId as id, firstNameLastName as label, photoURL as image, concat(state, if(district, concat('-', district), '')) as detail, 'c' as type from candidates where firstNameLastName like ? limit "+limit, ['%'+value+'%']).then(function(results) { 
        res.send({type:'candidates', data:results});
      });
    } else { 
      db.doQuery("select zip as id, zip as label, concat(city, ', ', state) as detail, 'z' as type from zipcode where zip like ? limit "+limit, [value+'%']).then(function(results) { 
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

        db.doQuery("select * from candidates where  state = ? and (office = 'U.S. Senate' or district in (?)) order by district", [state, districts]).then(function(results) {
          res.send({type:'zip', data: results});
          //console.log(results);
        }, next);

      } else { 
        next(new Error("Invalid Zipcode"));
      }
    }, next);

  },

  lookupCandidate: function(req, res, next) { 
    var candidateId = req.params.candidateId;

    db.deferredRequest({url: 'http://api.votesmart.org/CandidateBio.getBio?key='+ config.votesmart.apiKey +'&candidateId='+ candidateId}).then(function(data) {
      if (! data.error) { 
        res.send({type: 'candidate', data: data});
      } else {
        next(new Error("Invalid Candidate ID"));
      }
    }, next);
  },
};

