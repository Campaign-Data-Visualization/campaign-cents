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
.controller('CandidateListController', function($scope, $stateParams, DataRequestFactory) {
  // filter candidates by zipcode input from search page
  $scope.name = "Ted Cruz";
  $scope.input = $stateParams.input;
  // $scope.candidates = {'house': [{name: "Marlo Longley", party: "Libertarian/KochParty"},{name: "Liam Dorpalen", party: "Democrat"}], 'senate': [{name: "Liam Dorpalen", party: "Democrat"},{name: "Liam Dorpalen", party: "Democrat"}]};
  DataRequestFactory.getData($stateParams.input, function(arrayOfCandidates){
    $scope.candidates = arrayOfCandidates;

  })
  
});

