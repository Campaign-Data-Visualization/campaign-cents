'use strict';
angular.module('kochTracker.staticPages', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('kochTracker.aboutUs', {
      url: '/aboutUs',
      templateUrl: 'staticPages/aboutUs.tpl.html',
    })
    .state('kochTracker.theKochs', {
      url: '/theKochs',
      templateUrl: 'staticPages/theKochs.tpl.html',
    })
    .state('kochTracker.notFound', {
      url: '/notFound',
      templateUrl: 'staticPages/notFound.tpl.html',
    })

})
