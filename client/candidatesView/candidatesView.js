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
});
