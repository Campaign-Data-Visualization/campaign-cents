(function (angular) {
  "use strict";
  angular.module('campaign-cents', [
    'ui.router'
 ,'campaign-cents.main'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('campaign-cents', {
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  })
  .run(function ($state) {
    $state.transitionTo('campaign-cents.main');
  });
}(angular));



