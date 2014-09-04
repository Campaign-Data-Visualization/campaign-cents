'use strict';
angular.module('myApp.main.staticPages', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.aboutUs', {
      url: '/aboutUs',
      templateUrl: 'staticPages/aboutUs.tpl.html',
    })
    .state('myApp.main.theKochs', {
      url: '/theKochs',
      templateUrl: 'staticPages/theKochs.tpl.html',
    })
    .state('myApp.main.notFound', {
      url: '/notFound',
      templateUrl: 'staticPages/notFound.tpl.html',
    })

})
