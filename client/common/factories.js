(function(angular){
  "use strict";
  angular.module('myApp')

  .factory('DataRequestFactory', function($http, $location){
    var path =  '/candidateList';
    var getData = function(input, callback){
      console.log("inside the factory:"+input);
      return $http({
      	method: 'POST',
      	url: '/dataRequest',
      	data: {input: input}
      })
      .then(function(response){

        if(response.data.type === 'zip'){
          path = '/myApp/main/candidateList';
          callback(path);
        }else if(response.data.type === 'candidate'){
          path = '/orgProfile';
          callback(path);
        }else if(esponse.data.type === 'organization'){
          path = '/candidateProfile';
          callback(path);
        }
      })
    }
      return {
        'getData': getData
      };
  })
}(angular));