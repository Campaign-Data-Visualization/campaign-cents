'use strict';
var app = angular.module('myApp', [ 'ui.bootstrap', 'ui.router' ])
  .controller('adminController',  function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state){
    $scope.progress = 0;

    $scope.updateData = function() {
      console.log('ping!');
      DataRequestFactory.getData('admin', 'foo').then(function(data) {
        $scope.progress = 10;
        console.log(data);
      });
    }
  });

