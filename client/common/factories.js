'use strict';
var app = angular.module('kochTracker')

app.factory('DataRequestFactory', ['$http', '$messages', '$q', function($http, $messages, $q){

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
    }, 
    handleError)
  };
  
  var getAdmin = function(route, input) {
    return $http({
      method: 'GET',
      url: '/adminRequest/'+route+'/'+input,
    }).then(function(response) {
      return response.data.data;
    }, handleError);
  };

  var postData = function(route, data) {
    return $http({
      method: 'POST',
      url: '/dataRequest/'+route,
      data: data
    }).then(function(response) {
      return response.data.data;
    }, handleError);
  };

  var postAdmin = function(route, data) {
    return $http({
      method: 'POST',
      url: '/adminRequest/'+route,
      data: data
    }).then(function(response) {
      return response.data.data;
    }, handleError);
  };


  var handleError = function(response) {
    if(response.data && response.data.error) { 
      $messages.error(response.data.error);
    } else {
      $messages.error('Unable to complete request');
    }
    return $q.reject(response);
  };

  return {
    'getData': getData,
    'getAdmin': getAdmin,
    'postData': postData,
    'postAdmin': postAdmin,
  };
}]);

app.config(['$httpProvider', function($httpProvider) {
 $httpProvider.interceptors.push(['$q', function($q) {
   return {
      'request': function(config) {
        return config;
      },
     'requestError': function(rejection) {
        return $q.reject(rejection);
      },
      'response': function(response) {
        // do something on success
        if (! response.data || response.data.error) {
          return $q.reject(response);
        } else { 
          return response;
        }
      },
     'responseError': function(rejection) {
        // do something on error
        return $q.reject(rejection);
      }
    };
  }]);
}]);
