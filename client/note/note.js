angular.module('myApp.main.note', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.notes', {
      url: '/notes',
      templateUrl: 'note/note.tpl.html',
      controller: 'NoteController'
    });
})
.controller('NoteController', function ($scope) {
  $scope.message = 'Yooo!';
});
