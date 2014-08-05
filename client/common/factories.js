(function(angular){
  "use strict";
  angular.module('myApp')

  .factory('DataRequestFactory', function($http){
    var getData = function(input){
      console.log("inside the factory:"+input);
      return $http({
      	method: 'POST',
      	url: '/dataRequest',
      	data: input
      })
      .then(function(response){
        return response.data;
      })
    };

    return {
      'getData': getData
    };
  })
}(angular));