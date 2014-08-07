angular.module('myApp.main.candidateList', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidateList', {
      url: '/candidateList',
      templateUrl: 'candidateList/candidateList.tpl.html',
      controller: 'CandidateListController'
    });
})
.controller('CandidateListController', function ($scope, DataRequestFactory, $http) {
  // filter candidates by zipcode input from search page
  $scope.input = DataRequestFactory.inputValue;
  console.log("This is the search input within CandListController", $scope.input);
  $scope.candidates = {
  	house: [
   	  {
        name: 'Kevin L',
        zipcode: 12345,
        party: 1
   	  },{
        name: 'Liam D',
        zipcode: 12345,
        party: 2
   	  },{
        name: 'Kimberly R',
        zipcode: 54321,
        party: 1 
      }
  	],
  	senate: [
      {
        name: 'Jake C',
        zipcode: 12345,
        party: 1
   	  },{
        name: 'Jennifer P',
        zipcode: 12345,
        party: 2
   	  },{
        name: 'David L',
        zipcode: 54321,
        party: 1 
      }
  	]
  };
});
