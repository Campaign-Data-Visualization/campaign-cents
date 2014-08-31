'use strict';
angular.module('myApp')

.factory('DataRequestFactory', function($http){
  var getData = function(route, input, callback){
    return $http({
      method: 'GET',
      url: '/dataRequest/'+route+'/'+input,
      //data: {input: input}
    })
    .then(function(response){
      if (callback) { 
        callback(response.data.data);
      } else { 
        return response.data.data;
      }
    })
  };
  return {
    'getData': getData,
  };
});
