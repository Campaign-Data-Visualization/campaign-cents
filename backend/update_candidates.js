"use strict";


var Q  = require('q'),
    config = require('config'),
    exec = require('child_process').exec,
    db = require('../server/database.js'),
    geocoder = require('node-geocoder').getGeocoder('google', 'https', {apiKey:'AIzaSyAC5nITHwdy2MjQkgsqbgpXyYx-IWCBS0M'})

process.on('uncaughtException', function (err) {
  console.log(err);
})

var datadir = "backend/data/";

var promises = [];


console.log("refreshing CRP IDS");

/*
db.doQuery("drop table if exists CRP_IDs", function() { 
  exec("wget http://www.opensecrets.org/downloads/crp/CRP_IDs.xls -O "+datadir+"CRP_IDS.xls", function() { 
    exec('unoconv -v -f csv '+datadir+'CRP_IDS.xls', function() {
      exec('tail -n +14 '+datadir+'CRP_IDS.csv | csvsql --db mysql://root:@/kochtracker --insert --tables CRP_IDS', function(res, one, two) { 
        updateCandidates();
      });
    });
  });
});
*/
var updateCandidates = function() { 
  db.doQuery("delete from candidates").then(function() { 
    db.doQuery("select state from states").then(function(rows) { 
      var promises = [];
      //rows = [{state: 'AK'}]//, {state: 'WY'}, {state: 'DC'}];
      rows.forEach(function(state) { 
        var promise = fetchVoteSmartCandidates(state.state);
        promise.state = state.state;
        promise.then(function() {
          var pending = [];
          promises.forEach(function(p) {
            if (p) { pending.push(p.state); }
          });
          console.log(state.state + ' done. '+(pending.length-1)+ ' states pending ('+pending.join(',')+')');
        })
        promises.push(promise);
      });

      Q.all(promises).done(function() {
        db.doQuery("update candidates a join CRP_IDS b on substring_index(lastName, ' ', -1) = substring_index(CRPNAME, ',', 1) and state = substring(distidrunfor, 1, 2) and (district = '' or  lpad(district, 2, '0') = substring(distidrunfor, 3, 2)) set a.crpid = cid where crpid = ''").then(function() { 
          db.exit();
        });
      });
    });
  });
}

updateCandidates();

var fetchVoteSmartCandidates = function(state) {
  console.log('processing '+ state);
  var deferred = Q.defer();

  //This is a little cumbersome, but we need to fetch records for senators of previous senate classes, as they don't show up for the current cycle
  Q.all([
    db.deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeTypeState?key='+ config.votesmart.apiKey +'&stateId='+ state+'&officeTypeId=C'}),
    db.deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeState?key='+config.votesmart.apiKey+'&stateId='+state+'&officeId=6&&electionYear=2012'}),
    db.deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeState?key='+config.votesmart.apiKey+'&stateId='+state+'&officeId=6&&electionYear=2010'}),
    db.deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeState?key='+config.votesmart.apiKey+'&stateId='+state+'&officeId=6&&electionYear=2008'}),
  ]).done(function(results) { 
    var candidatePromises= [];

    results.forEach(function(result) { 
      if (result.candidateList) { 

        result.candidateList.candidate.forEach(function(candidate) { 
          candidate.party = candidate.electionParties.toString().match(/repub/i) ? 'Republican' : (candidate.electionParties.toString().match(/democ/i) ? 'Democratic' : 'Independent');
          //if (candidate.candidateId != 26817 && candidate.candidateId != 1721) { return; }

          if ((candidate.electionStatus == 'Running' || (candidate.officeName == 'U.S. Senate' && candidate.officeStatus == 'active')) && (candidate.party != 'Independent' || (candidate.electionStateId == 'VT' && candidate.lastName == 'Sanders'))) { 
            var candidate_promise = Q.defer();
            var can = {};
            can.voteSmartId = candidate.candidateId;
            can.firstNameLastName = candidate.ballotName;
            can.firstName = candidate.firstName;
            can.lastName = candidate.lastName;
            can.party = candidate.party;
            can.state = candidate.electionStateId;
            can.office = candidate.electionOffice;
            can.district = candidate.electionDistrictName == 'At-Large' ? 0 : candidate.electionDistrictName;
            can.incumbent = candidate.officeStatus == 'active' && candidate.electionOffice.toString() == candidate.officeName.toString();

            db.deferredRequest({url: 'http://api.votesmart.org/CandidateBio.getBio?key='+ config.votesmart.apiKey +'&candidateId='+ candidate.candidateId}).then(function(data) {
              var canBio = data.bio.candidate[0];
              var canOffice = {};
            
              if (data.bio.office) { 
                canOffice = data.bio.office[0];
                can.photoURL = canBio.photo;
                can.CRPId = canBio.crpId;
              };

              var canAddresses = [];
              db.deferredRequest({url: 'http://api.votesmart.org/Address.getCampaign?key='+ config.votesmart.apiKey +'&candidateId='+ candidate.candidateId}).then(function(data) {
                if (!data.error) { canAddresses = canAddresses.concat(data.address.office); }
                db.deferredRequest({url: 'http://api.votesmart.org/Address.getOffice?key='+ config.votesmart.apiKey +'&candidateId='+ candidate.candidateId}).then(function(data) {
                  if (!data.error) { canAddresses = canAddresses.concat(data.address.office); }
                  var address;

                  if (canAddresses[0]) {
                    canAddresses.forEach(function(item) {
                      var a = item.address[0];
                      if (!address && (a.typeId == 1 || a.typeId == 5)) { 
                        address = a;
                      }
                    });
                  }

                  var geoCodePromise = Q.defer();
                  if(address) {
                    can.address = address.street;
                    can.address_city = address.city;
                    can.address_state = address.state;
                    can.address_zip = address.zip;
                    geocoder.geocode(can.address+', '+can.address_city+', '+can.address_state+' '+can.address_zip).then(function(res) {
                      //console.log(res);
                      can.lat = res[0].latitude;
                      can.lng = res[0].longitude;
                      geoCodePromise.resolve();
                    }, function(err) {
                      console.log(err);
                      geoCodePromise.resolve();
                    })
                  } else {
                    geoCodePromise.resolve();
                    console.log("missing address for "+can.firstNameLastName);
                  }

                  geoCodePromise.promise.then(function() { 
                    db.doQuery("insert ignore into candidates set ?", can).then(function(data) { 
                      candidate_promise.resolve();
                    });
                  });
                });
              });
            });
            candidate_promise.promise.id = can.voteSmartId;
            /*
            candidate_promise.promise.then(function() { 
              var cans = [];
              candidatePromises.forEach(function(p) {
                if (p) { cans.push(p.id) }
              });
              console.log(cans.length+ ' cans pending for '+state+ ' ('+cans.join(',')+')');
            });
            */
            candidatePromises.push(candidate_promise.promise);

          };     
        });
      }
    });

    Q.all(candidatePromises).done(function() {
      deferred.resolve();
    });

  });
  deferred.prom
  return deferred.promise;
}
