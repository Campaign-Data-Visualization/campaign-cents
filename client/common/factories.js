// (function(angular){
  'use strict';
  angular.module('myApp')

  .factory('DataRequestFactory', function($http){
    var path =  '/candidateList';
    var inputValue = {};
    var candList = {};
    var candidates = {};
    var getData = function(input, callback){
      return $http({
        method: 'POST',
        url: '/dataRequest',
        data: {input: input}
      })
      .then(function(response){
        

        if(response.data.type === 'zip'){

        console.log("<---------response received------->")
        console.log("Response type: ", response.data.type);
        console.log(response.data.arrayOfCandidates);

        candidates.list = response.data.arrayOfCandidates;
        callback(response);
        // return candidates;

        }else if(response.data.type === 'candidate'){

          console.log("<---------response received------->")
          console.log("Response type: ", response.data.type);
          console.log(response.data.arrayOfCandidates);
          callback(response);
    
        }

      })

    };
    return {
      'getData': getData,
      'candList': candidates
    };
  });
// }(angular));