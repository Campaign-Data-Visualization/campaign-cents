// (function(angular){
  'use strict';
  angular.module('myApp')

  .factory('DataRequestFactory', function($http){
    var path =  '/candidateList';
    var inputValue = {};
    var candList = {};
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

        var arrayOfCandidates = response.data.arrayOfCandidates;
        return arrayOfCandidates

        }else if(response.data.type === 'candidate'){
    
        }
        console.log("<---------response received------->")
        console.log("Response type: ", response.data.type);
        console.log(response.data.arrayOfCandidates);

      })

    };
      return {
        'inputValue': inputValue,
        // 'candList': arrayOfCandidates,
        'getData': getData
      };
  });
// }(angular));