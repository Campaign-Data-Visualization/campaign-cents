'use strict';
angular.module('myApp.main.candidatesView.candidateList', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidatesView.candidateList', {
      url: '/zip/:input',
      templateUrl: 'candidateList/candidateList.tpl.html',
      controller: 'CandidateListController'
    });
})
/*
// Filters out congressman with regular expression selecting for first character of U
.filter('filterCongress', function () {  
  return function (candidates) {
    return candidates.filter(function (candidate) {
      return /U/i.test(candidate.electionOffice[0].substring(0, 1));
    });
  };
})
*/
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
.controller('CandidateListController', function($scope, $stateParams, DataRequestFactory, $state) {
  $scope.viewparams.zip = $stateParams.input;
  DataRequestFactory.getData('zip', $scope.viewparams.zip, function(response){
    $scope.candidates = response;
  });
});

