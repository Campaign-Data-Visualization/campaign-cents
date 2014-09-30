(function (angular) {
  'use strict';
  angular.module('kochTracker', [
    'ui.bootstrap',
    'ui.router',
    'ngFx',
    'countTo',
    'ui.router', 
    'angulartics',
    'angulartics.google.analytics',
    'kochTracker.explore',
    'kochTracker.landingPage',
    'kochTracker.staticPages',
    'kochTracker.candidatesView',
    'kochTracker.candidatesView.candidateList',
    'kochTracker.orgProfile',
    'kochTracker.candidatesView.candidateProfile'
    ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider, $anchorScrollProvider) {
    //$locationProvider.html5Mode(true).hashPrefix('#');

    $stateProvider
      .state('kochTracker', {
        url: '',
        abstract: true,
        templateUrl: 'app.tpl.html',
        controller: function($rootScope) {
          $rootScope.$on('$viewContentLoaded', function() { 
            $('body>ul.dropdown-menu').remove(); //remove dropdowns that sometimes stay
          })
        }
      });

      //This is some crazy stuff cuz when I reload the page, it adds a / to everything
      //$urlRouterProvider.when(/\/$|\/\?$/, function($match) {
        //return $match.input.replace(/\/$/, '');
      //})
      $urlRouterProvider.otherwise('/notFound');
      $uiViewScrollProvider.useAnchorScroll()
      //$anchorScrollProvider.disableAutoScrolling();
  })
}(angular));



