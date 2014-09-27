"use strict";

var Q  = require('q'),
    mysql = require('mysql'),
    config = require('config'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    db = require('../database.js'),
    nodemailer = require('nodemailer');

var transporter;

module.exports = exports = {
  search: function(req, res, next) { 
    var value = req.params.value;
    var limit = 8;

    if (isNaN(value)) {
      value = value.replace(/\.|\,/g, ' ');
      value = value.replace(/ /g, "%");

      db.doQuery("select voteSmartId as id, state, nameLastFirst as label, photoURL as image, concat(state, if(district, concat('-', district), '')) as detail, 'c' as type from candidates where nameSearch like ? limit "+limit, ['%'+value+'%']).then(function(results) { 
        res.send({type:'candidates', data:results});
      }, next);
    } else { 
      db.doQuery("select zip as id, state, zip as label, concat(city, ', ', state) as detail, 'z' as type from zipcode where zip like ? limit "+limit, [value+'%']).then(function(results) { 
        res.send({type:'zips', data:results});
      }, next);
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
    }, function(err) { next(new Error("Unable to contact zipcode lookup service")) });
  },

  lookupCandidateBio: function(req, res, next) { 
    var candidateId = req.params.candidateId;

    db.deferredRequest({url: 'http://api.votesmart.org/CandidateBio.getBio?key='+ config.votesmart.apiKey +'&candidateId='+ candidateId}).then(function(data) {
      if (! data.error) { 
        res.send({type: 'candidateBio', data: data});
      } else {
        next(new Error("Invalid Candidate ID"));
      }
    }, function(err) { next(new Error("Unable to contact candidate biography lookup service")) });
  },

  lookupCandidate: function(req, res, next) {
    var candidateId = req.params.candidateId;

    db.doQuery("select * from candidates where voteSmartId = ?", [candidateId]).then(function(data) {
      var profile = data[0];
      db.doQuery("select sum(if(cycle=2014 && koch_tier = 1, amount, 0)) as a,sum(if(cycle=2014 && koch_tier = 2, amount, 0)) as b, sum(if(cycle!=2014 && koch_tier = 1, amount, 0)) as c,  sum(if(cycle!=2014 && koch_tier = 2, amount, 0)) as d from koch_contribs where votesmartId = ? and for_against = 'f'", [candidateId]).then(function(data) {
        profile.data = { 
          'totals': Object.keys(data[0]).map(function(v) { return data[0][v];}) //convert to array
        }
        db.doQuery("select donor_name as name, koch_tier, sum(amount) as total, sum(if(cycle = 2014, amount, 0)) as current, sum(if(cycle = 2014, 0, amount)) as previous from koch_contribs b where votesmartid = ? and for_against = 'f' group by donor_name order by sum(amount) desc", [candidateId]).then(function(data) {
          profile.data.donors = data;
          res.send({type: 'candidateProfile', data:profile})
        }, next);
      }, next);
    }, next);
  },

  lookupAssets: function(req, res, next) {
    var action = req.params.action;
    var state = req.params.state;
    var results = {type:'assets', data: {}};
    db.doQuery("select layer, title, city, description from koch_assets where state = ?", state).then(function(data){
      data.forEach(function(asset) {
        var layer = asset.layer;
        if (! results.data[layer]) {
          results.data[layer] = [];
        }
        delete asset.layer;
        results.data[layer].push(asset);
      })
      res.send(results);
    }, next)
  },

  lookupMapData: function(req, res, next) { 
    var mapType = req.params.mapType;
    var results = {type:'markers', data: {}};
    if (mapType == 'summary') {
      db.doQuery("select lat, lng, 'candidate' as type, state from candidates where since2000contrib != 0 and lat != 0 and lng != 0 union select lat, lng, layer, state from koch_assets where country = 'us'").then(function(data) {
        results.data = data;
        res.send(results);
      }, next)
    }
    if (mapType == 'layers') {
      db.doQuery("select 'candidate' as layer, lat, lng, state, nameFirstLast as title, '' as description, format(since2000contrib, 0) as amount, voteSmartId as id from candidates where since2000contrib != 0 and lat != 0 and lng != 0 "+
          "union select layer, lat, lng, state, title, description, null, null from koch_assets where country = 'us'"
        ).then(function(data) {
        results.data = data;
        res.send(results);
      }, next)
    }
  },

  lookupStates: function(req, res, next) {
    var state = req.params.state;
    db.doQuery("select state_name from states where state = ?", state).then(function(data) { 
      res.send({type:'states', data:data[0]});
    }, next)
  },

  lookupData: function(req, res, next) {
    var dataType = req.params.dataType;
    var limit  = '';
    var order = '';
    var types = {
      voices: {
        query: "content where type='voices' and published = 1",
        order: 'image desc'
      }, 
      offenders: {
        query: "candidates a join content b on detail = votesmartid where type = 'offenders' and published = 1",
        order: 'since2000contrib desc'
      },
      facts: {
        query: "content where type = 'facts' and published = 1"
      },
      races: {
        query: "content where type = 'races' and published = 1"
      },
      kochCandidates: {
        query: "candidates where since2000contrib != 0 ",
        order: 'since2000contrib desc'
      }
    }
   
    if (! types[dataType]) { return next(new Error("invalid data type"))}

    if (req.params.random == 'random') {
      limit = ' limit 1';
      order = ' order by rand() ';
    } else if (types[dataType].order) {
      order = ' order by '+types[dataType].order;
    }

    db.doQuery("select * from "+types[dataType].query +order+limit).then(function(data) { 
      res.send({type:dataType, data:data});
    }, next)
  },

  shareStory: function(req, res, next) {
    var fields = ['name', 'email', 'city', 'state', 'story'];
    var d = new Date();
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
    var date = new Date(utc + (3600000*7)).toLocaleString();
    var mailOptions = {
        from: config.google.contactEmail, // sender address
        to: config.google.contactEmail, // list of receivers
        subject: "Victim's Voices Submission", // Subject line
    };
    var body = "A new Victim's Voice entry was submitted on "+date+"\n\n";
    var error;
    if (! transporter) { 
      transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: config.google.contactEmail,
              pass: config.google.contactEmailPassword
          }
      });
    }

    fields.forEach(function(field) {
      var f = req.body[field];
      if (! f) {
        error = field +" can not be blank";
      } else if ( (f.length > 50 && field != 'story') || f.length > 1000 ) {
        error = field +" is too long";
      } else if (field == 'email' && ! f.match(/.+@.+\..+/i)) {
        error = "email is invaild";
      } else {
        if (field != 'story') { 
          body += field+': '+f+'\n';
        } else { 
          body += 'story:\n\n'+f;
        }
      }
    })
    if (error) { 
      return next(new Error(error));
    }
    
    mailOptions.text = body;

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
        next(new Error("There was a problem sending your submission. Please try again later."))
      }else{
        res.send({type:'success', data: 'Success'});
      }
    });
  },
};

