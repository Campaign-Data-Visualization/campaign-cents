(function (angular) {
  "use strict";
  angular.module('myApp.main', ['ui.router', 'myApp.main.note', 'myApp.main.landingPage','myApp.main.candidateList', 'myApp.main.orgProfile','myApp.main.candidateProfile'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('myApp.main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main/main.tpl.html'
      });
  });
}(angular));
