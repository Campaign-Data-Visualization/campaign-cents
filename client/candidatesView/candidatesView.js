'use strict';
angular.module('myApp.main.candidatesView', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidatesView', {
      url: '/:state',
      abstract: true,
      templateUrl: 'candidatesView/candidatesView.tpl.html',
      controller: 'CandidatesViewController'
    })
})

.controller('CandidatesViewController', function($scope, $stateParams, DataRequestFactory, $state) {
  $scope.viewparams = {
    state: $stateParams.state,
    zip: ''
  };
});
