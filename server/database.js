"use strict";

var mysql = require('mysql'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    Q = require('q'),
    mysqlUtilities = require('mysql-utilities'),
    config = require('config');

// <<<<<<==========  Create MySQL connection =============>>>>>>>>

var connection_config = {};

if (config.mysql) { 
  connection_config = config.mysql;
} else {
  connection_config = {
    host     : process.env.OPENSHIFT_MYSQL_DB_HOST || '127.0.0.1',
    user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
    password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '',
    port : process.env.OPENSHIFT_MYSQL_DB_PORT || null,
    database : process.env.database || 'kochtracker'
  }
}

var pool = mysql.createPool(connection_config);

/*
function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    //connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}*/

exports.dbClose = function(callback) { 
  pool.end(callback);
}

exports.query = function(method, query, args) { 
  var deferred = Q.defer();
  
  //console.log("Running query "+query+ " with args "+args);
  pool.getConnection(function(err, connection) { 
    if (err) { 
        console.log("can't get db connection");
        deferred.reject(err);
    } else { 
      if (method != 'query') {
        mysqlUtilities.upgrade(connection);
      }
      connection[method](query, args, function(err, rows, field) { 
        connection.release();
         if (err) {
          console.log("Error running query "+query+ " with args "+args);
          console.log(err);
          deferred.reject(err);
        } else { 
          //console.log(rows.affectedRows);
          deferred.resolve(rows);
        }
      });
    }
  });
  return deferred.promise;
}

exports.doQuery = function(query, args) {
  return exports.query('query', query, args);
}

exports.deferredRequest = function(options) { 
  options.agent = false;
  options.headers = {
    "User-Agent": "Mozilla/4.0 (compatible; Project Vote Smart node.js client)",
    "Content-type": "application/x-www-form-urlencoded"
  };

  var deferred = Q.defer();
  //console.log('looking up '+options.url);
  request(options, function (error, response, body){
    if (!error && response.statusCode == 200){
      var contentType = response.headers['content-type'];
      if (contentType.match(/xml/)) { 
        parseString(body, function(err, result) { 
          if (! err) { 
            deferred.resolve(result);
          } else { 
            deferred.reject(result);
          }
        });
      } else {
        deferred.resolve(JSON.parse(body));
      }
    } else { 
      deferred.reject(error);
    }
  });
  return deferred.promise;
}

exports.exit = function(code) { 
  console.log("exiting with code "+code);
  exports.dbClose(function(err) { 
    process.exit(code);
  });
}
