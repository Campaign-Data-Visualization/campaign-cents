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
  $scope.candidates = DataRequestFactory.candList.list;
  console.log("Kevin's stuff: ", $scope.candidates);
  console.log("KEVIN'S STUFF: ", $scope.candidates.house);
  console.log("KEVIN'S STUFF: ", $scope.candidates.senate);

  // $scope.candidates = DataRequestFactory.getData().then(function(list){})

  // $scope.candidates = {
  // 	house: [
  //  	  {
  //       name: 'Kevin L',
  //       zipcode: 12345,
  //       party: 'Republican'
  //  	  },{
  //       name: 'Liam D',
  //       zipcode: 12345,
  //       party: 'Democrat'
  //  	  },{
  //       name: 'Kimberly R',
  //       zipcode: 54321,
  //       party: 'Democrat'
  //     }
  // 	],
  // 	senate: [
  //     {
  //       name: 'Jake C',
  //       zipcode: 12345,
  //       party: 'Democrat'
  //  	  },{
  //       name: 'Jennifer P',
  //       zipcode: 12345,
  //       party: 'Democrat'
  //  	  },{
  //       name: 'David L',
  //       zipcode: 54321,
  //       party: 'Republican'
  //     }
  // 	]
  // };
});

