"use strict";

var Q  = require('q'),
    config = require('config'),
    parseString = require('xml2js').parseString,
    db = require('../server/database.js'),
    exec = require('child_process').exec;

console.log("<--------------updating candidates----------------->");
exec("node backend/update_candidates.js", function(output) {
  console.log(output);
  console.log("<-------------updating crp data-------------------->");
  exec("node backend/update_crp_data.js", function(output) {
    console.log(output);
    exec("mysqldump -u root kochtracker candidates > backend/sql/candidates.sql", function() { 
      console.log("<----------------All done!------------------------->");
    });
  });
});

