angular.module('campaign-cents.main.note', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('campaign-cents.main.note', {
      url: '/notes',
      templateUrl: 'note/note.tpl.html',
      controller: 'NoteController'
    });
})
.controller('NoteController', function ($scope) {
  $scope.notes = [];
});