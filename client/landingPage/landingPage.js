'use strict';
angular.module('kochTracker.landingPage', ['ui.router', 'ngMap'])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider
    .state('kochTracker.landingPage', {
      url: '',
      templateUrl: 'landingPage/landingPage.tpl.html',
      controller: 'LandingPageController'
    });
}])

.controller('LandingPageController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
  $rootScope.title = "KochProblem.org";
  $scope.dayOne = 0;
  $scope.dayTwo = 0;
  $scope.kochTotal = 0;
  $scope.prevKochTotal = 0;
  $scope.duration = 4;
  $scope.tickerPopup = "Based off a stated goal made by Koch on June 14th, 2014, to raise $500 million for upcoming Senate campaigns.";
  $scope.calendarPopup = "Map reflects Koch Candidates, Assets, Campuses, and other Points of Interest.";
  $scope.tickerRefresh = 33;

  var today = new Date();
  var election = new Date('11/4/2014');
  var beginning = new Date('6/14/2014');
  var perDay = 500000000 / (election - beginning);

  var days = Math.ceil((election - today)/1000/3600/24).toString();

  if (days > 0) {
    $scope.dayOne = days > 9 ? days[0] : 0;
    $scope.dayTwo = days > 9 ? days[1] : days[0];
  } else {
    if (days < 0 ) {
      $scope.dayOne = -1;
    }
  }
  
  $scope.kochTotal = Math.ceil(perDay * (today - beginning));
  $timeout(function() {
    $scope.tickerRefresh = 99;
    $scope.duration = (election-today)/1000;
    $scope.prevKochTotal = $scope.kochTotal;
    $scope.kochTotal = 500000000;
  }, ($scope.duration*1000));
/*
  var updateTotal = function(first) {
    $scope.prevKochTotal = $scope.kochTotal;
    var today = new Date();
    if(! first) { 
      $scope.duration = .4;
      $timeout(updateTotal, 800);
    } else {
      $timeout(function() {
        $scope.prevKochTotal = $scope.kochTotal;
        $timeout(updateTotal, 500);
      }, 4000)
    }
    $scope.kochTotal = num;
  }
  updateTotal(true);*/

}]);
