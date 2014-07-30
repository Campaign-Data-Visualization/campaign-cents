angular.module('myApp.main.landingPage', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.landingPage', {
      url: '/landingPage',
      templateUrl: 'landingPage/landingPage.tpl.html',
      controller: 'SearchController'
    });
})
.controller('SearchController', function ($scope) {
  $scope.message = 'Search for a zip code / candidate / organization below';
});
