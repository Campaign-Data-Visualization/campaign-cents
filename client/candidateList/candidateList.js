'use strict';
angular.module('myApp.main.candidateList', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidateList', {
      url: '/zip:{input}',
      templateUrl: 'candidateList/candidateList.tpl.html',
      controller: 'CandidateListController'
    });
})
// Filters out congressman with regular expression selecting for first character of U
.filter('filterCongress', function () {  
  return function (candidates) {
    return candidates.filter(function (candidate) {
      return /U/i.test(candidate.electionOffice[0].substring(0, 1));
    });
  };
})
.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
      attrs.$observe('ngSrc', function(value) {
        if (!value && attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
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
    console.log("This is the response in the candidate list controller", response);
    $scope.candidates = response;
    console.log("this is the 0th element of candidates", $scope.candidates);
    
  });

});

