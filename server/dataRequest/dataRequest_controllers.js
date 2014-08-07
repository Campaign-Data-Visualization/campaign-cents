"use strict";

// var Note = require('./dataRequest_model.js'),
var    Q  = require('q'),
    mysql = require('mysql');

module.exports = exports = {
  get: function (req, res, next) {
    var $promise = Q.nbind(Note.find, Note);
    $promise()
      .then(function (notes) {
        res.json(notes);
      })
       .fail(function (reason) {
        next(reason);
      });
  },

  // handles client POST request by querying database with input and
  // responding with requested data
  post: function (req, res, next) {
    //candidateOrganizationZipcode is the user input in string format
    var candidateOrganizationZipcode = req.body.input;
    console.log("<---------------inside server:-------------->")
    //so we don't have to deal with the hyphon in the second part of zip codes
    //we're splitting off the first five
    var firstFiveChar = candidateOrganizationZipcode.slice(0,5);
    console.log("parseInt on first five char of input: "+ isNaN(firstFiveChar));
    if(isNaN(firstFiveChar)){
      //process as a candidate or organization
      console.log("IT'S A CANDIDATE/ORG");
      // <-------------QUERY THE DATADAE with the name ------------------>
      res.send({type:'candidate'});
    }else{
      //process as zip code
      console.log('ITS A ZIP CODE');
      res.send({type:'zip', input: candidateOrganizationZipcode});
      // <-------------QUERY THE DATADAE with the Zip ------------------>
      // connection.query('SELECT * FROM tablename', function(err, rows, fields) {
      //       if (err) throw err;
      //       console.log('The database is: ', rows, fields);
      //     });


    }

    // var $promise = Q.fcall(function(candidateOrganizationZipcode){
    //   // parse input to determine whether input is a zipcode or candidate/organization
    //     // if the first five characters/numbers are a zip code
    //     // assuming the input is a string - refactor if otherwise
    //     if (typeof parseInt(candidateOrganizationZipcode.slice(0,5)) === 'number') {
    //       // var zipcode = candidateOrganizationZipcode.slice(0, 5);
    //       // query the DB for the zip code info / candidate list
    //       // connection.query('SELECT * FROM tablename', function(err, rows, fields) {
    //       //   if (err) throw err;
    //       //   console.log('The database is: ', rows, fields);
    //       // });
    //       // return data;
    //     }else{
    //       // if input is candidate/organization ...
    //       // query database for candidate/organization specific information
            

    //         // if candidate ...
        
    //         // if organization ...

    //         // return data;
          
    //     }
      
              
      
    
    // });
    // $promise(candidateOrganizationZipcode)
    //   .then(function (data) {
    //     res.send(data);
    //   })
    //   .fail(function (reason) {
    //     next(reason);
    //   });
  }
};

