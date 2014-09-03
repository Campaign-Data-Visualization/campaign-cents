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
  $scope.candidateProfile = {};
  $scope.candidateBio = {};
  $scope.profileLoading = 1;
  $scope.bioLoading = 1;

  DataRequestFactory.getData('candidate', $scope.candidateId+'/bio').then(
    function(response){
      $scope.bioLoading = 0;
      $scope.candidateBio = response.bio;
    },
    function(response){
      $scope.bioLoading = 0;
    }
  );

  DataRequestFactory.getData('candidate', $scope.candidateId).then(
    function(response){
      $scope.profileLoading = 0;
      $scope.candidateProfile= response;
    },
    function(response){
      $scope.profileLoading = 0;
    }
  );


});
