"use strict";

var mysql       = require('mysql'),
    morgan      = require('morgan'),
    bodyParser  = require('body-parser'),
    middle      = require('./middleware'),
    api         = require("sunlight-congress-api"),
    VoteSmart   = require('votesmart'),
    config      = require('config'),
    db          = require('../database');

/*
 * Include all your global env variables here.
*/
module.exports = exports = function (app, express, routers) {
  app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 9000);
  app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
  app.set('base url', process.env.URL || 'http://localhost');
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  //simulate latency
  //app.use(function(req,res,next){setTimeout(next,1000)});
  app.use(middle.cors);
  app.use(express.static(__dirname + '/../../client'));
  app.use('/dataRequest', routers.DataRequestRouter);
  app.use(middle.logError);
  app.use(middle.handleError);
  app.use(middle.fourohfour);
};

//This DB section is commented out to deploy. 
//It should be uncommented once get cloud db running

// var success = function(data){
//     console.log("This was a successful Open Congress API call", data);
// }

// api.init("instert-api-key-here");

// api.votes().filter("year", "2012").call(success);

// <<<<<<<<<============================================>>>>>>>>>>
// Calling SUNLIGHT FOUNDATION API 
// var sunlightKey = config.get('sunlight.key');
// var sunlightUrl = config.get('sunlight.url')

// api.init({
//   key: sunlightKey,
//   url: sunlightUrl
// });

// console.log("The sunlight API just got called");

// var success = function(data){
//     console.log("This was a successful Open Congress API call", data);
// }

// api.votes().filter("year", "2012").call(success);

// api.legislators().filter("first_name", "John").call(success);





/*
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('<======================connected to DB as id ' + connection.threadId);
});
*/

// connection.query("select 2014contrib, since2000contrib from candidates where voteSmartId = 3217", function(err, rows, fields){
//   if (err) throw err;
//   console.log('<===========The database is SELECT-ing from the candidates table ==============>');
//   console.log(rows, fields);
// });

// connection.query("drop table candidates", function(err, rows, fields){
//   if (err) throw err;
//   console.log('<=========== The database is dropping the candidates table ==============>');
//   console.log(rows, fields);
// });

// connection.query("create table candidates (voteSmartId integer(10), firstName varchar(100), lastName varchar(100), firstNameLastName varchar(200), party varchar(100), state varchar(10), office varchar(100), 2014contrib integer(10), since2000contrib integer(10))", function(err, rows, fields){
//   if (err) throw err;
//   console.log('<=========== The database is creating candidates table ==============>');
//   console.log(rows, fields);
// });


//   if (err) throw err;
//   console.log("<===================inserted values into candidates table==================>");
// });



// connection.query('CREATE TABLE noWayThisExists (Name  varchar(255), Amount varchar(255))', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('The database is: ', rows, fields);
// });
// connection.query('CREATE TABLE koch ( col1 VARCHAR(255), col2 VARCHAR(255), col3 VARCHAR(255), col4 VARCHAR(255))', function(err, rows, fields){
//   if (err) throw err;
//   console.log("<================= created koch table ==================>")
// });

//   if (err) throw err;
//   console.log("<===================inserted REAL values in koch table==================>");
// });

// var dataPath = '"D:\home\site\wwwroot\server\main\koch1.csv"';
// // var dataPath = '"/Users/Dorpalen-Barry/Documents/campaign-cents/campaign-cents/server/main/koch1.csv"';

// connection.query('LOAD DATA INFILE ' + dataPath + ' INTO TABLE koch COLUMNS TERMINATED BY "," LINES TERMINATED BY "\r"'

//   , function(err, rows, fields){
//   if (err) throw err;
//   console.log("<===================loaded csv data into koch table==================>");
// });


// connection.query("SELECT * from koch", function(err, rows, fields){
//   if (err) throw err;
//   console.log('<===========The database is SELECT-ing from koch table ==============>');
//   console.log(rows, fields);
// });
// connection.query("INSERT INTO koch (col1, col2, col3, col4) VALUES ('Yo1', 'Yo2', 'Yo3', 'Yo4')", function(err, rows, fields){
//   if (err) throw err;
//   console.log("<===================inserted values in koch table==================>");
// });

// connection.query("SELECT * from koch", function(err, rows, fields){
//   if (err) throw err;
//   console.log('<===========The database is SELECT-ing from koch table ==============>');
//   console.log(rows, fields);
// });
// connection.query(
// "CREATE DATABASE money2;

// USE money2;

// CREATE TABLE koch (
//   col1 VARCHAR(255),
//   col2 VARCHAR(255),
//   col3 VARCHAR(255),
//   col4 VARCHAR(255)
// );

// LOAD DATA INFILE ß
// INTO TABLE koch
// COLUMNS TERMINATED BY ','
// LINES TERMINATED BY '\r';",
// function(err, rows, fields) {
//   if (err) throw err;
//   console.log('<==============The database is done being created========> ');
// });





