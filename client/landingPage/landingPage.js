'use strict';
angular.module('kochTracker.landingPage', ['ui.router', 'ngMap'])

.config(function ($stateProvider) {
  $stateProvider
    .state('kochTracker.landingPage', {
      url: '/',
      templateUrl: 'landingPage/landingPage.tpl.html',
      controller: 'LandingPageController'
    });
})

.controller('LandingPageController', function($scope, $timeout){
  $scope.dayOne = 0;
  $scope.dayTwo = 0;
  $scope.kochTotal = 0;
  $scope.prevKochTotal = 0;
  $scope.duration = 2;
  $scope.tickerPopup = "Based off a stated goal made June 14th, 2014, to aggregate and distribute $500 million for upcoming Senate campaigns.<br/>Source: <a target='_new' href='http://www.thenation.com/article/180267/exclusive-behind-koch-brothers-secret-billionaire-summit'>The Nation - 6/17/14</a>"
  $scope.calendarPopup = "Map reflects Koch Candidates, Assets, Campuses, and other Points of Interest.";

  var today = new Date();
  var election = new Date('11/4/2014');
  var beginning = new Date('6/14/2014');
  var perDay = 5000000 / (election - beginning);

  var days = Math.ceil((election - today)/1000/3600/24).toString();

  if (days > 0) {
    $scope.dayOne = days > 9 ? days[0] : 0;
    $scope.dayTwo = days > 9 ? days[1] : days[0];
  } else {
    if (days < 0 ) {
      $scope.dayOne = -1;
    }
  }

  var updateTotal = function(first) {
    var today = new Date();
    $scope.prevKochTotal = $scope.kochTotal;
    $scope.kochTotal = Math.ceil(perDay * (today - beginning));
    $timeout(updateTotal, 2500);
  }
  updateTotal(true);

});
