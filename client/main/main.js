(function (angular) {
  'use strict';
  angular.module('myApp.main', ['ui.router', 'myApp.main.landingPage','myApp.main.candidateList', 'myApp.main.orgProfile','myApp.main.candidateProfile','myApp.main.aboutUs','myApp.main.theKochs'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('myApp.main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main/main.tpl.html'
      });
  });
}(angular));
