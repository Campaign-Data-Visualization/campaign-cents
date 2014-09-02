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
  $scope.candidates = [];
  $scope.loading = 1;
  $scope.viewparams.zip = $stateParams.input;

  DataRequestFactory.getData('zip', $scope.viewparams.zip).then(function(response){
    $scope.loading = 0;
    $scope.candidates = response;
  }, function(err) {
    $scope.loading = 0;
  });
});