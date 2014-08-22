(function (angular) {
  'use strict';
  angular.module('myApp', [
    'ui.router',
    'ngFx',
    'myApp.main',
    'autocomplete'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/myApp/main/landingPage');

    $stateProvider
      .state('myApp', {
        url: '/myApp',
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });
}(angular));



