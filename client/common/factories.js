(function(angular){
  "use strict";
  angular.module('myApp')
  .factory('DataRequestFactory', function($http){
    var getData = function(input){
      return $http({
      	method: 'POST',
      	url: '/dataRequest',
      	data: input
      })
      .then(function(response){
        return response.data;
      });
    };
  });
}(angular));