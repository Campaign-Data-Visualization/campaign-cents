'use strict';
angular.module('myApp.main.candidateProfile', ['ui.router'])
.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.candidateProfile', {
      url: '/search:{input}',
      templateUrl: 'candidateProfile/candidateProfile.tpl.html',
      controller: 'CandidateProfileController'
    });
})
.controller('CandidateProfileController', function ($scope, $http) {
  $scope.message = 'See the candidate and related data';
  $scope.name = 'Ted Cruz';
  $scope.loadCandidates = function(){
    $http.get('https://congress.api.sunlightfoundation.com/legislators?last_name=Cruz&apikey=49e2cbc00fdd496bbd036a26d1858d33'
      ).success(function (data){
        console.log('success with get to api', data);
      $scope.candidates = data;
    }).error(function () {
        console.log('An unexpected error ocurred!');
    });
  };
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
  $scope.tierOne = 24000;
  $scope.tierTwo = 35000;
  $scope.politician = {
    'bio': 'Rafael Edward Ted Cruz (born December 22, 1970) is the junior United States Senator from Texas. Elected in 2013, he is the first Cuban American or Latino to hold the office. Cruz is a member of the Republican Party. He served as Solicitor General of Texas from 2003 to May 2008, after being appointed by Texas Attorney General Greg Abbott.[2] Between 1999 and 2003, Cruz served as the director of the Office of Policy Planning at the Federal Trade Commission, an Associate Deputy Attorney General at the United States Department of Justice, and as Domestic Policy Advisor to U.S. President George W. Bush on the 2000 Bush-Cheney campaign. Cruz was also an Adjunct Professor of Law at the University of Texas School of Law in Austin, where he taught U.S. Supreme Court litigation, from 2004 to 2009.Cruz was the Republican nominee for the Senate seat vacated by fellow Republican Kay Bailey Hutchison. On July 31, 2012, he defeated Lieutenant Governor David Dewhurst in the Republican primary runoff, 57–43. Cruz defeated the Democrat, former state Representative Paul Sadler, in the general election held on November 6, 2012; he prevailed with 56–41 over Sadler. Cruz openly identifies with the Tea Party movement, and has been endorsed by the Republican Liberty Caucus. On November 14, 2012, Cruz was appointed vice-chairman of the National Republican Senatorial Committee, the committee that seeks to elect more Republicans to the Senate.'
 };
});
