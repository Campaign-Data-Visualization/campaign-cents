angular.module('myApp.main.orgProfile', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.orgProfile', {
      url: '/orgProfile',
      templateUrl: 'orgProfile/orgProfile.tpl.html',
      controller: 'OrgProfileController'
    });
})
.controller('OrgProfileController', function ($scope) {
  $scope.message = 'Check out this org profile. So so dirty.';
});
