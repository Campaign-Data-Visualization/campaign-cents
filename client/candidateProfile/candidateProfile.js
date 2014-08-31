'use strict';
angular.module('myApp.main.candidatesView.candidateProfile', ['ui.router'])
.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidatesView.candidateProfile', {
      url: '/candidate/:input',
      templateUrl: 'candidateProfile/candidateProfile.tpl.html',
      controller: 'CandidateProfileController'
    });
})
.controller('CandidateProfileController', function($scope, $stateParams, DataRequestFactory) {
  $scope.candidateId = $stateParams.input;
  DataRequestFactory.getData('candidate', $scope.candidateId, function(response){
    $scope.candidateBio = response.bio;
  });
});
