'use strict';
var app = angular.module('myApp', [ 'ui.bootstrap', 'ui.router' ])
  .controller('adminController',  function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state, $messages, $timeout){
    $scope.success = 0;
    $scope.progress = 0;
    $scope.message = "";
    $scope.counts = {};
    $scope.whichData = 'all';

    $scope.dataTypes = [
      {action: 'campus', method: 'adminMap', niceName: 'Campuses'},
      {action: 'assets', method: 'adminMap', niceName: 'Assets'},
      {action: 'voices', method: 'adminSheet', niceName: "Victim's Voices"},
      {action: 'offenders', method: 'adminSheet', niceName: "Worst Offenders"},
      {action: 'facts', method: 'adminSheet', niceName: "Koch Facts"},
    ]

    $scope.updateAllData = function() {
      reset();
      $messages.clearMessages();
      $scope.progress = 10;
      var chain = $scope.dataTypes.reduce(function(dataTypePromise, dataType) {
        return dataTypePromise.then(function(res) {
          return $scope.updateData(dataType).then(function(data) {
            res.push(data);
            return res;
          })
        })
      }, $q.when([]));

      chain.then(function(res) {
        $scope.progress = 100;
        $timeout(function() {
          $scope.progress = 0;
          $scope.success = 1;
        }, 1000)
      })
    }
    
    $scope.updateData = function(dataType) {
      if ($scope.whichData != 'all' && dataType.action != $scope.whichData) {
        return $q.when();
      };

      $scope.message = 'Updating '+dataType.niceName+'...';
      return DataRequestFactory.getAdmin(dataType.method, dataType.action).then(function(data) {
        $scope.counts[dataType.niceName] = data;
        $scope.progress += (100-10)/$scope.dataTypes.length;
      }, reset);
    }

    var reset = function() {
      $scope.counts = {};
      $scope.progress = 0;
      $scope.success = 0;
    }
  });

