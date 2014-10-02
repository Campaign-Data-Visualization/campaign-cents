'use strict';
angular.module('kochTracker.staticPages', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {

  $stateProvider
    .state('kochTracker.aboutUs', {
      url: '/aboutUs',
      templateUrl: 'staticPages/aboutUs.tpl.html',
      controller: ['$rootScope', function($rootScope) {
        $rootScope.title = "KochProblem.org - About Us";
      }]
    })
    .state('kochTracker.theKochs', {
      url: '/theKochs',
      templateUrl: 'staticPages/theKochs.tpl.html',
      controller: ['$rootScope', function($rootScope) {
        $rootScope.title = "KochProblem.org - The Kochs";
      }]
    })
    .state('kochTracker.notFound', {
      url: '/notFound',
      templateUrl: 'staticPages/notFound.tpl.html',
      controller: ['$rootScope', function($rootScope) {
        $rootScope.title = "KochProblem.org - Not Found";
      }]
    })

}])
