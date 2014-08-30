"use strict";


var Q  = require('q'),
    config = require('config'),
    exec = require('child_process').exec,
    db = require('../server/database.js');

var datadir = "backend/data/";

var promises = [];

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

var updateCandidates = function() { 
  db.doQuery("delete from candidates").then(function() { 
    //db.doQuery("select state from states where state = 'VT'").then(function(rows) { 
    db.doQuery("select state from states").then(function(rows) { 
      var promises = [];

      rows.forEach(function(state) { 
        var promise = fetchVoteSmartCandidates(state.state);
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
					if ((candidate.electionStatus == 'Running' || (candidate.officeName == 'U.S. Senate' && candidate.officeStatus == 'active')) && (candidate.party != 'Independent' || (candidate.electionStateId == 'VT' && candidate.lastName == 'Sanders'))) { 
						var candidate_promise = Q.defer();
						db.deferredRequest({url: 'http://api.votesmart.org/CandidateBio.getBio?key='+ config.votesmart.apiKey +'&candidateId='+ candidate.candidateId}).then(function(data) {
							var can = {};

							var canBio = data.bio.candidate[0];
              var canOffice = {};
              if (data.bio.office) { 
                canOffice = data.bio.office[0];
                can.photoURL = canBio.photo;
                can.CRPId = canBio.crpId;
              
              };

							can.voteSmartId = candidate.candidateId;
							can.firstNameLastName = candidate.ballotName;
							can.firstName = candidate.firstName;
							can.lastName = candidate.lastName;
							can.party = candidate.party;
							can.state = candidate.electionStateId;
							can.office = candidate.electionOffice;
							can.district = candidate.electionDistrictName == 'At-Large' ? 0 : candidate.electionDistrictName;
							can.incumbent = candidate.officeStatus == 'active' && candidate.electionOffice.toString() == candidate.officeName.toString()

							db.doQuery("insert ignore into candidates set ?", can).then(function(data) { 
								candidate_promise.resolve();
							});
						});
						candidatePromises.push(candidate_promise.promise);
					}
				});
			}
		});

		Q.all(candidatePromises).done(function() {
			console.log('done with '+ state);
			deferred.resolve();
		});

	});

	return deferred.promise;
}
