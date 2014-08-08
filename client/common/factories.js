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
          // var list = response.data.listCandidates;
          // console.log('INSIDE DATAREQUESTFACTORY, SHOW LIST: ', list);
          candList.list = response.data.listCandidates;
          console.log('Inside the promise, candList', candList.list);
          path = 'myApp.main.candidateList';
          callback(path, inputValue);
          return candList;
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
        console.log('Inside the promise', inputValue.inputValue);
        return inputValue;
      });
      // .then(function(response){
      //   candList.list = response.data.listCandidates;
      //   console.log('Inside the promise, candList', candList.list);
      //   return candList;
      // })
    };
      return {
        'inputValue': inputValue,
        'candList': candList,
        'getData': getData
      };
  });
// }(angular));
