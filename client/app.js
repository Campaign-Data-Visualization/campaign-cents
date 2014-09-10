(function (angular) {
  'use strict';
  angular.module('myApp', [
    'ui.bootstrap',
    'ui.router',
    'ngFx',
    'myApp.main',
    'countTo'
    ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/notFound');

    $stateProvider
      .state('myApp', {
        url: '',
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });
}(angular));



