(function (angular) {
  "use strict";
  angular.module('campaign-cents.main', ['ui.router', 'campaign-cents.main.note'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('campaign-cents.main', {
        url: '/main',
        templateUrl: 'main/main.tpl.html',
        controller: 'MainController'
      });
  })
  .controller('MainController', function ($state) {
    $state.transitionTo('campaign-cents.main.note');
  });
}(angular));
