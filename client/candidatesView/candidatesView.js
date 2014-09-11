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
  $scope.viewparams = {
    state: $stateParams.state,
    zip: ''
  };

  DataRequestFactory.getData('assets', 'state/'+$scope.viewparams.state).then(function(data) {
    $scope.layers = data;
  })

  $scope.safeHTML = function(string) {
    return $sce.trustAsHtml(string);
  }
})

.directive('kochFact', function(DataRequestFactory) {
  return {
    restrict: 'A',
    scope: true,
    template: "<img ng-class='fact.detail|lowercase' ng-src='images/icon-{{fact.detail|lowercase}}.svg'>"+
      "<h3 ng-bind-html='fact.description|safehtml'></h3>",
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
    template: "<h3>Worst Offender"+
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
