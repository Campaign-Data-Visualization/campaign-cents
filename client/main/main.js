(function (angular) {
  'use strict';
  angular.module('myApp.main', ['ui.router', 'myApp.main.explore', 'myApp.main.landingPage','myApp.main.staticPages', 'myApp.main.candidatesView','myApp.main.candidatesView.candidateList', 'myApp.main.orgProfile','myApp.main.candidatesView.candidateProfile'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('myApp.main', {
        url: '',
        abstract: true,
        templateUrl: 'main/main.tpl.html'
      });
  });
}(angular));
