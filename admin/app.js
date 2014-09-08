'use strict';
var app = angular.module('myApp', [ 'ui.bootstrap', 'ui.router' ])
  .controller('adminController',  function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state, $messages, $timeout){
    $scope.success = 0;
    $scope.progress = 0;
    $scope.message = "";
    $scope.counts = {};

    $scope.updateData = function() {
      reset();
      $messages.clearMessages();
      $scope.progress = 10;
      $scope.message = 'Updating Campuses...';
      DataRequestFactory.getData('admin', 'campus').then(function(data) {
        $scope.counts['campuses'] = data;
        $scope.progress = 50;
        $scope.message = 'Updating Assets...';
        DataRequestFactory.getData('admin', 'assets').then(function(data) {
          $scope.counts['assets'] = data;
          $scope.progress = 100;
          $timeout(function() {
            $scope.progress = 0;
            $scope.success = 1;
          }, 1000)
        }, reset);
      }, reset);
    }

    var reset = function() {
      $scope.counts = {};
      $scope.progress = 0;
      $scope.success = 0;
    }
  });

