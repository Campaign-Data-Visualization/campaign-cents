"use strict";

var    Q  = require('q'),
    mysql = require('mysql'),
    config = require('config'),
    request = require('request'),
    parseString = require('xml2js').parseString;

var connection = mysql.createConnection({
  host     : process.env.host || 'localhost',
  user     : process.env.user || 'root',
  password : process.env.password || '',
  database : process.env.database || 'testdb'
});


/*
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});
*/

var promises = [];

var dbConnect = function() {
	var deferred = Q.defer();
	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			deferred.reject();
		} else {
			console.log('<======================connected to DB as id ' + connection.threadId);
			deferred.resolve();
		}
	});
	return deferred.promise;
}

var doQuery = function(query, args) { 
	var deferred = Q.defer();

	if (!connection.threadId) { 
		console.log('not connected');
		dbConnect().then(function() { 
			doQuery(query, args).then(function(rows) { 
				deferred.resolve(rows);
			});
		});
	} else { 
		//console.log("Running query "+query+ " with args "+args);

		connection.query(query, args, function(err, rows, field) { 
		   if (err) throw err;
			//console.log(rows.affectedRows);
			deferred.resolve(rows);
		});
	}

	return deferred.promise;
}

var deferredRequest = function(options) { 
	options.agent = false;
	options.headers = {
		"User-Agent": "Mozilla/4.0 (compatible; Project Vote Smart node.js client)",
		"Content-type": "application/x-www-form-urlencoded"
	};

	var deferred = Q.defer();
	//console.log('looking up '+options.url);
	request(options, function (error, response, body){
		if (!error && response.statusCode == 200){
			parseString(body, function(err, result) { 
				if (! err) { 
					deferred.resolve(result);
				} else { 
					throw err;
				}
			});
		} else { 
			throw err;
		}
	});
	return deferred.promise;
}

doQuery("delete from candidates").then(function() { 
	//doQuery("select state from states where state = 'AK'").then(function(rows) { 
	doQuery("select state from states").then(function(rows) { 
		var promises = [];

		rows.forEach(function(state) { 
			var promise = fetchVoteSmartCandidates(state.state);
			promises.push(promise);
		});

		Q.all(promises).done(exit);
	});
});

var fetchVoteSmartCandidates = function(state) {
	console.log('processing '+ state);
	var deferred = Q.defer();
	
	//This is a little cumbersome, but we need to fetch records for senators of previous senate classes, as they don't show up for the current cycle
	Q.all([
		deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeTypeState?key='+ config.votesmart.apiKey +'&stateId='+ state+'&officeTypeId=C'}),
		deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeState?key='+config.votesmart.apiKey+'&stateId='+state+'&officeId=6&&electionYear=2012'}),
		deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeState?key='+config.votesmart.apiKey+'&stateId='+state+'&officeId=6&&electionYear=2010'}),
		deferredRequest({url: 'http://api.votesmart.org/Candidates.getByOfficeState?key='+config.votesmart.apiKey+'&stateId='+state+'&officeId=6&&electionYear=2008'}),
	]).done(function(results) { 
		var candidatePromises= [];

		results.forEach(function(result) { 
			if (result.candidateList) { 
				result.candidateList.candidate.forEach(function(candidate) { 
					if (candidate.electionStatus == 'Running' || (candidate.officeName == 'U.S. Senate' && candidate.officeStatus == 'active')) { 
						var candidate_promise = Q.defer();
						deferredRequest({url: 'http://api.votesmart.org/CandidateBio.getBio?key='+ config.votesmart.apiKey +'&candidateId='+ candidate.candidateId}).then(function(data) {
							var canBio = data.bio.candidate[0];
							var can = {};
							can.voteSmartId = candidate.candidateId;
							can.firstNameLastName = candidate.ballotName;
							can.firstName = candidate.firstName;
							can.lastName = candidate.lastName;
							can.party = candidate.electionParties;
							can.state = candidate.electionStateId;
							can.office = candidate.electionOffice;
							can.district = candidate.electionDistrictName == 'At-Large' ? 0 : candidate.electionDistrictName;
							can.incumbent = candidate.officeStatus == 'active' && candidate.electionOffice.toString() == candidate.officeName.toString()
							can.photoURL = canBio.photo;
							can.CRPId = canBio.crpId;
							doQuery("insert ignore into candidates set ?", can).then(function(data) { 
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

var exit = function(code) { 
	console.log("exiting with code "+code);
	connection.end(function(err) { 
		process.exit(code);
	});
}
