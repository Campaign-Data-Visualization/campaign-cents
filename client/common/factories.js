'use strict';
var app = angular.module('myApp')

app.factory('DataRequestFactory', function($http, $messages){
  var getData = function(route, input, callback){
    return $http({
      method: 'GET',
      url: '/dataRequest/'+route+'/'+input,
      //data: {input: input}
    })
    .then(function(response){
      if (response.data.error) { 
        handleError(response);
      } else { 
        if (callback) { 
          callback(response.data.data);
        } else { 
          return response.data.data;
        }
      }
    }, 
    handleError)
  };

  var handleError = function(response) {
      if(response.data && response.data.error) { 
        $messages.error(response.data.error);
      }
  };

  return {
    'getData': getData,
  };
});
