'use strict';
angular.module('myApp.main.candidateProfile', ['ui.router'])
.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidateProfile', {
      url: '/name:{input}/id:{id}',
      templateUrl: 'candidateProfile/candidateProfile.tpl.html',
      controller: 'CandidateProfileController'
    });
})
.controller('CandidateProfileController', function($scope, $stateParams, DataRequestFactory) {
    $scope.input = $stateParams.input;
  // $scope.id = "26732";
 //  $scope.loadCandidateBio = function(){
 //    $http.get("" + $scope.id + "&o=JSON" 
 //   ).success(function (data){
 //     console.log('success with get to api', data);
 //     $scope.candidateBio = data;
 //   }).error(function () {
 //       console.log('An unexpected error ocurred!');
 //   });
 // };

  var mutatedCandidateID = "a"+$stateParams.id;
  DataRequestFactory.getData(mutatedCandidateID, function(response){
    console.log("This is the response in the factory", response);
    $scope.candidateBio = response.data.candidateInfo.bio;
    console.log("In the factory should show candidateBio object", $scope.candidateBio); 
  });




});
