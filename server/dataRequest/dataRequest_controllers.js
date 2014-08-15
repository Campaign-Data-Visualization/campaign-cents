"use strict";

// var Note = require('./dataRequest_model.js'),
var    Q  = require('q'),
    mysql = require('mysql'),
    VoteSmart = require('votesmart'),
    config = require('config');

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
    console.log("<---------------inside server:-------------->")  
    console.log(req.body);

    if(!req.body.input){
      res.send({type:'Welcome, mr. JSON. You have arrived in serverland.'});
    }

    var candidateOrganizationZipcode = req.body.input.input;
    

    //<=====================================================>
    //we're slicing off the first five so we don't have to deal with the hyphon in the second part of zip codes
    if(isNaN(candidateOrganizationZipcode)){
      var firstFiveChar = candidateOrganizationZipcode.slice(0,5);
    }else{
      var firstFiveChar = candidateOrganizationZipcode
    }

    // <====================================================>
    //sort based on zip vs candidate name
    if(isNaN(firstFiveChar)){
      //process as a candidate
      console.log("IT'S A CANDIDATE");
      // <-------------QUERY THE DATADAE with the name ------>
      res.send({type:'candidate'});
    }else{
      //process as zip code
      console.log('ITS A ZIP CODE');

      var zip = firstFiveChar;
      var year = 2014;
      
      // votesmart.Candidates(zip , year, 'NULL', zipSortingFunc)
      // .then(arrayOfCandidates){
      //   res.send({type:'zip', arrayOfCandidates: arrayOfCandidates})
      // };

      // // res.send({type:'zip', arrayOfCandidates: candidates});
      // res.send({type:'zip'});
      // <-------------QUERY THE DATADAE with the Zip ------------------>
      // connection.query('SELECT * FROM tablename', function(err, rows, fields) {
      //       if (err) throw err;
      //       console.log('The database is: ', rows, fields);
      //     });
      
      //<====================================================>

    }
  }
};

//<<<<<<<<<<<<<<<<<<==Calling Votesmart API===>>>>>>>>>>>>
// Load apiKey from config.json - you can replace this code // and manually set your API key here

  var apiConfig = config.get('votesmart.apiKey');
  VoteSmart.prototype.Candidates = function(zipcode, electionYear, zip4, callback){
    var params = {
      zip5: zipcode,
      electionYear: electionYear,
      zip4: zip4
    };
    this.makeRequest('Candidates.getByZip', params, callback);
  };

  console.log("This is my api key ", apiConfig);

  var votesmart = new VoteSmart(apiConfig);

  //callback for votesmart.Candidates
  var zipSortingFunc = function(err, json) {
    var arrayOfCandidates = [];
    if (err) throw err;
    for (var i = 0; i < json.candidateList.candidate.length; i++){
      if((json.candidateList.candidate[i].electionStage === 'General') && (json.candidateList.candidate[i].electionOffice === 'U.S. House' 
      || json.candidateList.candidate[i].electionOffice === 'U.S. Senate')){
        console.log("<--------about to send res------->");
        
        arrayOfCandidates.push(json.candidateList.candidate[i]);
      }
    }
  res.send({type:'zip', arrayOfCandidates: candidates});
  return arrayOfCandidates;
  }
  

  // // <------------Alternative API Queries------------>
  // // votesmart.candidateBio('26732', function(err, json) {
  // //   if (err) throw err;
  // //   console.log(json);
  // // });

  // // votesmart.npat('26732', function(err, json) {
  // //   if (err) throw err;
  // //   // console.log(json);
  // //   json.npat.section.forEach(function(e) {
  // //     console.log(e);
  // //   })
  // // });



