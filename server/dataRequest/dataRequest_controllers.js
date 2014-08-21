"use strict";

// var Note = require('./dataRequest_model.js'),
var    Q  = require('q'),
    mysql = require('mysql'),
    config = require('config'),
    request = require('request'),
    parseString = require('xml2js').parseString;

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
    var candidateOrganizationZipcode = req.body.input;
    
    //we're slicing off the first five so we don't have to deal with the hyphon in the second part of zip codes
    if(isNaN(candidateOrganizationZipcode)){
      var firstFiveChar = candidateOrganizationZipcode.slice(0,5);
    }else{
      var firstFiveChar = candidateOrganizationZipcode;
    }

    //sort based on zip vs candidate name
    if(isNaN(firstFiveChar)){ //process as a candidate
      console.log("<-----------IT'S A CANDIDATE----------->");
      // <-------------QUERY THE DATADASE with the name ------>

      res.send({type:'candidate'});

    }else{ //process as zip code
      console.log('<------------ITS A ZIP CODE---------->');
      var zip = firstFiveChar;
      console.log(zip);

      var options = {
        url: 'http://api.votesmart.org/Candidates.getByZip?key='+ config.votesmart.apiKey +'&zip5='+ zip,
        agent: false,
        headers: {
        "User-Agent": "Mozilla/4.0 (compatible; Project Vote Smart node.js client)",
        "Content-type": "application/x-www-form-urlencoded"}
      }

      request(options, function (error, response, body){
        if (!error && response.statusCode == 200){
          parseString(body, function(err, result){
            var arrayOfCandidates = result.candidateList.candidate
            res.send({type:'zip', arrayOfCandidates: arrayOfCandidates});
          })
        }
      })
    }
  }
};

      // for (var i = 0; i < json.candidateList.candidate.length; i++){
      //   if((json.candidateList.candidate[i].electionStage === 'General') && (json.candidateList.candidate[i].electionOffice === 'U.S. House' 
      //   || json.candidateList.candidate[i].electionOffice === 'U.S. Senate')){
      //     arrayOfCandidates.push(json.candidateList.candidate[i]);
      //   }
      // }
      // return arrayOfCandidates;
 


