(function (angular) {
  'use strict';
  angular.module('kochTracker', [
    'ui.bootstrap',
    'ui.router',
    'countTo',
    'ui.router', 
    'angulartics',
    'angulartics.google.analytics',
    'kochTracker.explore',
    'kochTracker.landingPage',
    'kochTracker.staticPages',
    'kochTracker.candidatesView',
    'kochTracker.candidatesView.candidateList',
    'kochTracker.candidatesView.candidateProfile'
    ])
  .config(['$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $uiViewScrollProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('kochTracker', {
        url: '',
        abstract: true,
        templateUrl: 'app.tpl.html',
        controller: ['$rootScope', function($rootScope) {
          $rootScope.title = 'KochProblem.org';
          $rootScope.$on('$viewContentLoaded', function() { 
            $('body>ul.dropdown-menu').remove(); //remove dropdowns that sometimes stay
          });
        }]
      });
      //This is some crazy stuff cuz when I reload the page, it adds a / to everything
      //$urlRouterProvider.when(/\/$|\/\?$/, function($match) {
        //return $match.input.replace(/\/$/, '');
      //})
      $urlRouterProvider.otherwise('/');
      $uiViewScrollProvider.useAnchorScroll();
      //$anchorScrollProvider.disableAutoScrolling();
  }]);
}(angular));



