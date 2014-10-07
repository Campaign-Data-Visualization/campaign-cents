'use strict';
angular.module('kochTracker.candidatesView.candidateList', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider
    .state('kochTracker.candidatesView.candidateList', {
      url: '/zip/:input',
      templateUrl: 'candidateList/candidateList.tpl.html',
      controller: 'CandidateListController'
    });
}])
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
  };
})
.controller('CandidateListController', ['$scope', '$rootScope', '$stateParams', 'DataRequestFactory', function($scope, $rootScope, $stateParams, DataRequestFactory) {
  $rootScope.title = "KochProblem.org - Get Local - "+$stateParams.state+ ' - '+ $stateParams.input;
  $scope.candidates = [];
  $scope.loading = 1;
  $scope.viewparams.zip = $stateParams.input;

  DataRequestFactory.getData('zip', $scope.viewparams.zip).then(function(response){
    $scope.loading = 0;
    $scope.candidates = response;
  }, function(err) {
    $scope.loading = 0;
  });
}]);