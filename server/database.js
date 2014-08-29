"use strict";

var mysql = require('mysql'),
Q = require('q');
// <<<<<<==========  Create MySQL connection =============>>>>>>>>

var connection = mysql.createConnection({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
  user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
  password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '',
  port : process.env.OPENSHIFT_MYSQL_DB_PORT || '',
  database : process.env.database || 'kochtracker'
});


var dbConnect = function() {
	var deferred = Q.defer();
	if (!connection.threadId) { 
		connection.connect(function(err) {
			if (err) {
				console.error('error connecting: ' + err.stack);
				deferred.reject();
			} else {
				console.log('<======================connected to DB as id ' + connection.threadId);
				deferred.resolve();
			}
		});
	} else {
		deferred.resolve();
	}
	return deferred.promise;
}

exports.doQuery = function(query, args) { 
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

dbConnect();
