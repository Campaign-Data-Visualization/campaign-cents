'use strict';
var app = angular.module('kochTracker', [ 'ui.bootstrap', 'ui.router', 'kochTracker' ])
  .controller('adminController',  function($scope, $window, $modal, $http, DataRequestFactory, $rootElement, $location, $q, $state, $messages, $timeout){
    if ($location.host() != 'localhost' && $location.protocol() != 'https') {
      $window.location.href = $location.absUrl().replace('http', 'https');
    }

    $scope.logged_in = 'wait';

    $scope.success = 0;
    $scope.fail = 1;
    $scope.progress = 0;
    $scope.message = "";
    $scope.counts = {};
    $scope.whichData = 'all';

    $scope.dataTypes = [
      {action: 'campus', method: 'adminMap', niceName: 'Campuses'},
      {action: 'assets', method: 'adminMap', niceName: 'Assets'},
      {action: 'voices', method: 'adminSheet', niceName: "Victim's Voices"},
      {action: 'offenders', method: 'adminSheet', niceName: "Koch Heads"},
      {action: 'facts', method: 'adminSheet', niceName: "Koch Facts"},
      {action: 'races', method: 'adminSheet', niceName: "Key Races"},
      {action: 'realtime', method: 'adminSheet', niceName: "Realtime Contributions"},
    ]

    DataRequestFactory.getAdmin('auth', 'checkLogin').then(function(data) {
      $scope.logged_in = data.login;
    }, function(err){
      $scope.logged_in = -2;
      $messages.clearMessages();
    })

    $scope.$watch('logged_in', function() {
      if ($scope.logged_in <= 0) {
        var modalInstance = $modal.open({
          backdrop: 'static',
          keyboard: false,
          windowClass: 'panel-info',
          templateUrl: 'login.html',
          resolve: {
            login: function() { return $scope.logged_in; }
          },
          controller: function($scope, login) {
            $scope.logged_in = login;
            $scope.user = {
              username: '',
              password: '',
            }
            $scope.login = function() {
              DataRequestFactory.postAdmin('login', {username: $scope.user.username, password: $scope.user.password}).then(function(data) {
                if (data.login) {
                  modalInstance.close(data.login);
                } else { 
                  $scope.user.password = '';
                  $scope.logged_in = 0;
                }
              })
            }
          }
        });
        modalInstance.result.then(function(res) {
          $scope.logged_in = res;
        })
      }
    })

    $scope.logout = function() {
      DataRequestFactory.getAdmin('auth', 'logout').then(function(data) {
        $scope.logged_in = data;
        console.log(data);

      })
    }

    $scope.updateAllData = function() {
      reset();
      $messages.clearMessages();
      $scope.progress = 10;
      var chain = $scope.dataTypes.reduce(function(dataTypePromise, dataType) {
        return dataTypePromise.then(function(res) {
          return $scope.updateData(dataType).then(function(data) {
            res.push(data);
            return res;
          }, handleError)
        }, handleError)
      }, $q.when([]));

      chain.then(function(res) {
        $scope.progress = 100;
        $timeout(function() {
          $scope.progress = 0;
          if (! $scope.error) {
            $scope.success = 1;
          }
        }, 300)
      })
    }
    
    $scope.updateData = function(dataType) {
      console.log(dataType)
      console.log($scope.whichData)
      if ($scope.whichData != 'all' && dataType.action != $scope.whichData) {
        console.log(dataType.action)
        return $q.when();
      };

      $scope.message = 'Updating '+dataType.niceName+'...';
      return DataRequestFactory.getAdmin(dataType.method, dataType.action).then(function(data) {
        $scope.counts[dataType.niceName] = data;
        $scope.progress += (100-10)/$scope.dataTypes.length;
      }, handleError);
    }

    var handleError = function(err) {
      reset();
      if (err.data && err.data.error == 'Logged Out') {
        $messages.clearMessages();
        $scope.logged_in = -1;
      } else {
        $scope.error = 1;
      }
    }
    var reset = function() {
      $scope.counts = {};
      $scope.progress = 0;
      $scope.error = 0;
      $scope.success = 0;
    }
  });

