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

  $scope.input = $stateParams.input;
  DataRequestFactory.getData($stateParams, function(arrayOfCandidates){
  	$scope.candidates = arrayOfCandidates;
  })
  

});

