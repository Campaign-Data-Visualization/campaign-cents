'use strict';
angular.module('myApp.main.candidateList', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidateList', {
      url: '/search:{input}',
      templateUrl: 'candidateList/candidateList.tpl.html',
      controller: 'CandidateListController'
    });
})
.filter('startsWithJ', function () {
  return function (candidates) {
    return candidates.filter(function (candidate) {
      return /J/i.test(candidate.firstName[0].substring(0, 1));
    });
  };
})
.controller('CandidateListController', function($scope, $stateParams, DataRequestFactory) {
  // filter candidates by zipcode input from search page
  $scope.input = $stateParams.input;
  // $scope.candidates = {'house': [{name: "Marlo Longley", party: "Libertarian/KochParty"},{name: "Liam Dorpalen", party: "Democrat"}], 'senate': [{name: "Liam Dorpalen", party: "Democrat"},{name: "Liam Dorpalen", party: "Democrat"}]};
  // DataRequestFactory.getData($stateParams.input, function(arrayOfCandidates){
  //   $scope.candidates = arrayOfCandidates;
  //   console.log("This is my candidates array in cand list", $scope.candidates);
  // }) 
  // $scope.candidates = DataRequestFactory.getData($stateParams.input, function(){
  //   // $scope.candidates = candList;
  //   console.log("Inside the candidates array in cand list");
  // }); 
  DataRequestFactory.getData($stateParams.input, function(response){
    console.log("This is the response", response);
    $scope.candidates = response;
    
  });
});

