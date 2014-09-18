'use strict';
angular.module('kochTracker.candidatesView', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('kochTracker.candidatesView', {
      url: '/:state',
      abstract: true,
      templateUrl: 'candidatesView/candidatesView.tpl.html',
      controller: 'CandidatesViewController'
    })
})

.controller('CandidatesViewController', function($scope, $stateParams, DataRequestFactory, $state, $sce) {
  $scope.layers = {};
  $scope.dayOne = 0;
  $scope.dayTwo = 0;
  $scope.viewparams = {
    state: $stateParams.state,
    zip: ''
  };

  DataRequestFactory.getData('assets', 'state/'+$scope.viewparams.state).then(function(data) {
    $scope.layers = data;
  })

  var today = new Date();
  var election = new Date('11/4/2014');
  var days = Math.ceil((election - today)/1000/3600/24).toString();

  if (days > 0) {
    $scope.dayOne = days > 9 ? days[0] : 0;
    $scope.dayTwo = days > 9 ? days[1] : days[0];
  } else {
    if (days < 0 ) {
      $scope.dayOne = -1;
    }
  }

})

.directive('kochFact', function(DataRequestFactory) {
  return {
    restrict: 'A',
    scope: true,
    template: "<h3>Koch Fact</h3>"+
      "<p ng-bind-html='fact.description|safehtml'></p>",
    link: function(scope, element, attribs) {
      scope.fact = {};
      DataRequestFactory.getData('fetch', 'facts/random').then(function(data) {
        scope.fact = data[0];
      })
    }
  }
})

.directive('worstOffender', function(DataRequestFactory) {
  return {
    restrict: 'A',
    scope: true,
    template: "<h3>Worst Offender</h3>"+
      "<img width='20px' ng-src='{{offender.photoURL}}'>"+
      "<h4>{{offender.nameFirstLast}}</h4>"+
      "<p ng-bind-html='offender.description|safehtml'></p>",
    link: function(scope, element, attribs) {
      scope.offender = {};
      DataRequestFactory.getData('fetch', 'offenders/random').then(function(data) {
        scope.offender = data[0];
      })
    }
  }
})
