// (function(angular){
  "use strict";
  angular.module('myApp')

  .factory('DataRequestFactory', function($http, $location){
    var path =  '/candidateList';
    var inputValue = {};
    var getData = function(input, callback){
      return $http({
      	method: 'POST',
      	url: '/dataRequest',
      	data: {input: input}
      })
      .then(function(response){    
        if(response.data.type === 'zip'){
          path = 'myApp.main.candidateList';
          callback(path, inputValue);
        }else if(response.data.type === 'candidate'){
          path = 'myApp.main.candidateProfile';
          callback(path);
        }else if(response.data.type === 'organization'){
          path = 'myApp.main.orgProfile';
          callback(path);
        }
      })
      .then(function(response){
        inputValue.inputValue = input;
        console.log("Inside the promise", inputValue.inputValue);
        return inputValue; 
      })
    }
      return {
        'inputValue': inputValue,
        'getData': getData
      };
  })
// }(angular));