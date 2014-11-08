"use strict";


var Q  = require('q'),
    config = require('config'),
    exec = require('child_process').exec,
    db = require('../server/database.js'),
    geocoder = require('node-geocoder').getGeocoder('google', 'https', {apiKey:config.google.apiKey})

process.on('uncaughtException', function (err) {
  console.log(err);
})

var datadir = "backend/data/";

var promises = [];

var updateCandidates = function() { 
  db.doQuery("delete from candidates").then(function() { 
    db.doQuery("select state from states").then(function(rows) { 
      var promises = [];
      //rows = [{state: 'PA'}, {state: 'MI'}, {state: 'DC'}];
      rows = [{state: 'ME'}];
      rows.forEach(function(state) { 
        var promise = fetchVoteSmartCandidates(state.state);
        promises.push(promise);
        promise.state = state.state;
        promise.then(function() {
          var pending = [];
          promises.forEach(function(p) {
            if (p) { pending.push(p.state); }
          });
          console.log(state.state + ' done. '+(pending.length-1)+ ' states pending ('+pending.join(',')+')');
        })
      });

      Q.all(promises).then(function() {
        db.doQuery("update candidates a join CRP_IDS b on substring_index(lastName, ' ', -1) = substring_index(CRPNAME, ',', 1) and state = substring(distidrunfor, 1, 2) and (district = '' or  lpad(district, 2, '0') = substring(distidrunfor, 3, 2)) set a.crpid = cid where crpid = ''").then(function() { 
          db.exit();
        });
      });
    });
  });
}

var fetchVoteSmartCandidates = function(state) {
  console.log('processing '+ state);
  var deferred = Q.defer();

  //This is a little cumbersome, but we need to fetch records for senators of previous senate classes, as they don't show up for the current cycle
  Q.all([
    db.deferredRequest({url: 'http://api.votesmart.org/Officials.getByOfficeTypeState?key='+ config.votesmart.apiKey +'&stateId='+ state+'&officeTypeId=C'}),
    db.deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeTypeState?key='+ config.votesmart.apiKey +'&stateId='+ state+'&officeTypeId=C'}),
  ]).then(function(results) { 
    var candidatePromises= [];
    var current = {};

    var queryCount = 0;
    results.forEach(function(result) { 
      if (result.candidateList) {

        result.candidateList.candidate.forEach(function(candidate) { 
          var party = candidate.electionParties[0] ? candidate.electionParties[0].toString() : candidate.officeParties[0].toString();
          candidate.party = party.match(/repub/i) ? 'Republican' : (party.match(/democ/i) ? 'Democratic' : 'Independent');
          //if (candidate.candidateId != 26817 && candidate.candidateId != 1721) { return; }
          if (
              (candidate.electionStatus == 'Running' || (!candidate.electionStatus[0] && candidate.officeStatus == 'active')) &&  //don't get non-running non-members
              (candidate.party != 'Independent' || candidate.candidateId == '27110' || candidate.candidateId == '116787' || candidate.candidateId == '22381') //limit to primary parties & Bernie Sanders
            ) { 
            if(queryCount == 0) { 
              current[candidate.candidateId] = 1;
            } else {
              if (current[candidate.candidateId]) {
                return; //We already have this candidate
              }
            }
            var candidate_promise = Q.defer();
            var can = {};
            can.voteSmartId = candidate.candidateId;
            can.ballotName = candidate.ballotName;
            can.firstName = candidate.firstName;
            can.lastName = candidate.lastName;
            can.preferredName = candidate.preferredName;
            can.middleName = candidate.middleName;
            can.nameSuffix = candidate.suffix;
            can.nameFirstLast = can.preferredName + ' ' + (can.middleName != '' ? can.middleName+' ' : '') + can.lastName + (can.nameSuffix != '' ? ' '+can.nameSuffix : '' );
            can.nameLastFirst = can.lastName + ', ' + can.preferredName + (can.middleName != '' ? ' ' + can.middleName : '') + (can.nameSuffix != '' ? ' ' + can.nameSuffix : '' );
            if (can.firstName == can.preferredName) { 
              can.nameSearch = [can.firstName, can.middleName, can.lastName, can.firstName].join(' ');
            } else { 
              can.nameSearch = [can.firstName, can.preferredName, can.middleName, can.lastName, can.firstName, can.preferredName].join(' ');
            }
            can.party = candidate.party;
            can.state = candidate.electionStateId[0] || candidate.officeStateId;
            can.office = candidate.electionOffice[0] && candidate.electionOfficeTypeId == 'C' ? candidate.electionOffice[0] : candidate.officeName;
            var district = candidate.electionDistrictName[0] && candidate.electionOfficeTypeId == 'C' ? candidate.electionDistrictName[0] : candidate.officeDistrictName;
            if (district == 'At-Large' || district == 'Delegate') { 
              can.district = 0;
            } else if (can.office == 'U.S. Senate') { 
              can.district = '';
            } else { 
              can.district = district;
            }
                        
            db.deferredRequest({url: 'http://api.votesmart.org/CandidateBio.getBio?key='+ config.votesmart.apiKey +'&candidateId='+ candidate.candidateId}).then(function(data) {
              var canBio = data.bio.candidate[0];
              var canOffice = {};
            
              if (data.bio.office) { 
                canOffice = data.bio.office[0];
                can.photoURL = canBio.photo;
                can.CRPId = canBio.crpId;
              };

              if (queryCount == 1) {
                can.electionStatus = 'Challenger';
              } else if (canOffice && canOffice.nextElect > 2014 && canOffice.name[0] == 'U.S. Senate') {
                can.electionStatus = 'Not up for reelection';
              } else if (! data.bio.election || data.bio.election[0].status != 'Running') {
                can.electionStatus = 'Outgoing';
              } else if (candidate.officeStatus == 'active' && candidate.electionOffice.toString() == candidate.officeName.toString()) {
                can.electionStatus = 'Incumbent';
              } else { 
                can.electionStatus = 'Challenger';
              }

              if (data.bio.election && data.bio.election[0].status != 'Running') {
                console.log(can.voteSmartId + ' '+data.bio.election[0].status);
              }
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
                      if (res[0] && res[0].latitude) {
                        can.lat = res[0].latitude;
                        can.lng = res[0].longitude;
                      } 
                      geoCodePromise.resolve();
                    }, function(err) {
                      console.log(err);
                      geoCodePromise.resolve();
                    })
                  } else {
                    geoCodePromise.resolve();
                    console.log("missing address for "+can.nameLastFirst);
                  }
                  geoCodePromise.promise.then(function() { 
                    db.doQuery("insert ignore into candidates set ?", can).then(function(data) { 
                      candidate_promise.resolve();
                    }, function(err) { console.log(err); });
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
      queryCount++;
    });

    Q.all(candidatePromises).then(function() {
      deferred.resolve();
    });

  });
  return deferred.promise;
}

console.log("refreshing CRP IDS");
db.doQuery("drop table if exists CRP_IDs", function() { 
  exec("wget http://www.opensecrets.org/downloads/crp/CRP_IDs.xls -O "+datadir+"CRP_IDS.xls", function() { 
    exec('unoconv -v -f csv '+datadir+'CRP_IDS.xls', function() {
      exec('tail -n +14 '+datadir+'CRP_IDS.csv | csvsql --db mysql://root:@/kochtracker --insert --tables CRP_IDS', function(res, one, two) { 
         updateCandidates();
      });
    });
  });
});
