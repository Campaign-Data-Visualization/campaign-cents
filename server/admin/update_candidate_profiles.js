"use strict";

var Q  = require('q'),
    mysql = require('mysql'),
    config = require('config'),
    db = require('../database.js');

module.exports = exports = {
  updateCandidates: function(closePool) {
    var deferred = Q.defer();
    var promises  = [];
    db.doQuery("delete from candidateProfiles")
      .then(function() { return db.doQuery("delete from koch_contribs where source = 'realtime'"); })
      .then(function() { return db.doQuery("insert into koch_contribs select * from realtime_contribs"); })
      .then(function() { return db.doQuery("update candidates set 2014contrib = 0, since2000contrib = 0"); })
      .then(function() { return db.doQuery("update candidates join (select sum(amount) as total, sum(if(cycle = 2014, amount,0)) as current,  votesmartid from koch_contribs where for_against = 'f' group by votesmartid) b using(votesmartid) set 2014contrib = current, since2000contrib = total"); })
      .then(function() { return db.doQuery("select voteSmartId from candidates"); })
      .then(function(data) {
        data.forEach(function(id) {
          var p = exports.updateCandidate(id.voteSmartId);
          promises.push(p);
        })
        Q.all(promises).then(function() {
          if (closePool) { 
            db.dbClose();
          }
          deferred.resolve();
        })
      });
    return deferred.promise;
  },
  updateCandidate: function(candidateId) {
    var deferred = Q.defer();
      db.doQuery("select a.*, b.published as worst from candidates a left join content b on detail = voteSmartId where voteSmartId = ?", [candidateId])
      .then(function(data) {
        var profile = data[0];
        db.doQuery("select sum(if(cycle=2014 && koch_tier = 1, amount, 0)) as a,sum(if(cycle=2014 && koch_tier = 2, amount, 0)) as b, sum(if(cycle!=2014 && koch_tier = 1, amount, 0)) as c,  sum(if(cycle!=2014 && koch_tier = 2, amount, 0)) as d from koch_contribs where votesmartId = ? and for_against = 'f'", [candidateId]).then(function(data) {
          profile.data = { 
            'totals': Object.keys(data[0]).map(function(v) { return data[0][v];}) //convert to array
          }
          db.doQuery("select donor_name as name, koch_tier, sum(amount) as total, sum(if(cycle = 2014, amount, 0)) as current, sum(if(cycle = 2014, 0, amount)) as previous from koch_contribs b where votesmartid = ? and for_against = 'f' group by donor_name order by sum(amount) desc", [candidateId]).then(function(data) {
            profile.data.donors = data;
            var profile_string = JSON.stringify(profile);
            db.doQuery("insert into candidateProfiles set voteSmartId = ?, profile = ?", [candidateId, profile_string]).then(function() {
              deferred.resolve();
            }, error)
            //res.send({type: 'candidateProfile', data:profile})
          }, error);
        }, error);
      }, error)
      .catch(function(err) {
        error(err);
        console.log('reject');
        deferred.reject();
      })

    return deferred.promise;
  }
}

var error = function(err) {
  if (next) {
    next(err);
  } else {
    console.log('err')
    console.log(err);
  }
}