(function (angular) {
  'use strict';
  angular.module('myApp', [
    'ui.bootstrap',
    'ui.router',
    'ngFx',
    'myApp.main',
    ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('');

    $stateProvider
      .state('myApp', {
        url: '',
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });
}(angular));



