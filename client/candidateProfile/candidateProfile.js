'use strict';
angular.module('kochTracker.candidatesView.candidateProfile', ['ui.router'])
.config(['$stateProvider', function ($stateProvider) {

  $stateProvider
    .state('kochTracker.candidatesView.candidateProfile', {
      url: '/candidate/:input',
      templateUrl: 'candidateProfile/candidateProfile.tpl.html',
      controller: 'CandidateProfileController'
    });
}])
.controller('CandidateProfileController', ['$scope', '$rootScope', '$stateParams', 'DataRequestFactory', function($scope, $rootScope, $stateParams, DataRequestFactory) {
  $rootScope.title = "KochProblem.org - Get Local - "+$stateParams.state;
  $scope.candidateId = $stateParams.input;
  $scope.candidateProfile = {};
  $scope.candidateBio = {};
  $scope.profileLoading = 1;
  $scope.bioLoading = 1;
  $scope.totals = [];
  $scope.topDonors = {};
  $scope.donors = {};

  // Disabling bio while votesmart is broken
  // DataRequestFactory.getData('candidate', $scope.candidateId+'/bio').then(
  //   function(response){
  //     $scope.bioLoading = 0;
  //     $scope.candidateBio = response.bio;
  //   },
  //   function(response){
  //     $scope.bioLoading = 0;
  //   }
  // );
  $scope.bioLoading = 0;

  DataRequestFactory.getData('candidate', $scope.candidateId).then(
    function(response){
      $scope.profileLoading = 0;
      $scope.candidateProfile= response;
      $rootScope.title = "KochProblem.org - Get Local - "+$stateParams.state+" - "+$scope.candidateProfile.nameFirstLast;
      $scope.totals = $scope.candidateProfile.data.totals;
      $scope.topDonors = $scope.candidateProfile.data.top_donors;
      $scope.donors = $scope.candidateProfile.data.donors;
    },
    function(response){
      $scope.profileLoading = 0;
    }
  );
}]);
