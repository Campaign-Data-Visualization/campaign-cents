angular.module('myApp.main.candidateProfile', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidateProfile', {
      url: '/candidateProfile',
      templateUrl: 'candidateProfile/candidateProfile.tpl.html',
      controller: 'CandidateProfileController'
    });
})
.controller('CandidateProfileController', function ($scope) {
  $scope.message = 'See the candiadate and related data';
  $scope.name = 'Ted Cruz';
});
