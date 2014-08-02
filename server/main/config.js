"use strict";

var mysql       = require('mysql'),
    morgan      = require('morgan'),
    bodyParser  = require('body-parser'),
    middle      = require('./middleware');



/*
 * Include all your global env variables here.
*/
module.exports = exports = function (app, express, routers) {
  app.set('port', process.env.PORT || 9000);
  app.set('base url', process.env.URL || 'http://localhost');
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(middle.cors);
  app.use(express.static(__dirname + '/../../client'));
  app.use('/dataRequest', routers.DataRequestRouter);
  app.use(middle.logError);
  app.use(middle.handleError);
};

//This DB section is commented out to deploy. 
//It should be uncommented once get cloud db running

var connection = mysql.createConnection({
  host     : process.env.host || 'localhost',
  user     : process.env.user || 'root',
  password : process.env.password || '',
  database : process.env.database || 'testdb'
});


connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('<======================connected to DB as id ' + connection.threadId);
});

// connection.query('CREATE TABLE noWayThisExists (Name  varchar(255), Amount varchar(255))', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('The database is: ', rows, fields);
// });
// connection.query('CREATE TABLE koch ( col1 VARCHAR(255), col2 VARCHAR(255), col3 VARCHAR(255), col4 VARCHAR(255))', function(err, rows, fields){
//   if (err) throw err;
//   console.log("<================= created koch table ==================>")
// });

connection.query("INSERT INTO koch (col1, col2, col3, col4) VALUES ('Yo1', 'Yo2', 'Yo3', 'Yo4')", function(err, rows, fields){
  if (err) throw err;
  console.log("<===================inserted values in koch table==================>")
});
connection.query("SELECT * from koch", function(err, rows, fields){
  if (err) throw err;
  console.log('The database is SELECTing from koch table';
});
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






