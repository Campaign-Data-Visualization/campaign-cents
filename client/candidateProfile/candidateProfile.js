angular.module('myApp.main.candidateProfile', ['ui.router'])
.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidateProfile', {
      url: '/candidateProfile',
      templateUrl: 'candidateProfile/candidateProfile.tpl.html',
      controller: 'CandidateProfileController'
    });
})
.controller('CandidateProfileController', function ($scope) {
  $scope.message = 'See the candidate and related data';
  $scope.name = 'Ted Cruz';
  $scope.funding =  {
    donors: [
                    {
                      'recipient': 'Ted Cruz',
                      'title': 'National Rifle Association',
                      'amount': 5000,
                      'year': 2009
                    },
                    {
                      'recipient': 'Ted Cruz',
                      'title': 'Republican National Committee',
                      'amount': 2500,
                      'year': 2009
                    },
                    {
                      'recipient': 'Ted Cruz',
                      'title': 'Pizza Hut',
                      'amount': 3000,
                      'year': 2010
                    }
            ]
  };
});
