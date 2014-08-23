// (function(angular){
  'use strict';
  angular.module('myApp')

  .factory('DataRequestFactory', function($http){
    var path =  '/candidateList';
    var inputValue = {};
    var candList = {};
    var candidates = {};
    var candBio = {};
    var getData = function(input, callback){
      return $http({
        method: 'POST',
        url: '/dataRequest',
        data: {input: input}
      })
      .then(function(response){
        if(response.data.type === 'zip'){

        console.log("<---------response received------->")
        console.log("Response type should be Zip: ", response.data.type);
        console.log(response.data.arrayOfCandidates);
        console.log("here are the properties of response.data", response.data);

        candidates.list = response.data.arrayOfCandidates;
        callback(response);
        // return candidates;

        }else if(response.data.type === 'candidate'){

          console.log("<---------response received------->")
          console.log("Response type should be candidate: ", response.data.type);
          candBio.bio = response.data.candidateBio;
          console.log("Here the candidate Bio is on an object to be returned", candBio.bio);
          callback(response);
        }
      })
    };
    return {
      'getData': getData,
      'candList': candidates,
      'candBio': candBio
    };
  });
// }(angular));