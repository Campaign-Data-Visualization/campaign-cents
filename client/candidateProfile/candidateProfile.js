'use strict';
angular.module('myApp.main.candidateProfile', ['ui.router'])
.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidateProfile', {
      url: '/candidateProfile',
      templateUrl: 'candidateProfile/candidateProfile.tpl.html',
      controller: 'CandidateProfileController'
    });
})
.controller('CandidateProfileController', function ($scope, $http) {
  $scope.id = "26732";
  $scope.loadCandidateBio = function(){
    $http.get(""  + $scope.id + "&o=JSON" 
   ).success(function (data){
     console.log('success with get to api', data);
     $scope.candidateBio = data;
   }).error(function () {
       console.log('An unexpected error ocurred!');
   });
 };
});
