'use strict';
angular.module('kochTracker.candidatesView', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('kochTracker.candidatesView', {
      url: '/:state',
      abstract: true,
      templateUrl: 'candidatesView/candidatesView.tpl.html',
      controller: 'CandidatesViewController'
    })
})

.controller('CandidatesViewController', function($scope, $stateParams, DataRequestFactory, $state, $sce) {
  $scope.layerLoading = 1;
  $scope.layers = {};
  $scope.dayOne = 0;
  $scope.dayTwo = 0;
  $scope.viewparams = {
    state: $stateParams.state,
    zip: ''
  };

  DataRequestFactory.getData('assets', 'state/'+$scope.viewparams.state).then(function(data) {
    $scope.layers = data;
    $scope.layerLoading = 0;
  })

  var today = new Date();
  var election = new Date('11/4/2014');
  var days = Math.ceil((election - today)/1000/3600/24).toString();

  if (days > 0) {
    $scope.dayOne = days > 9 ? days[0] : 0;
    $scope.dayTwo = days > 9 ? days[1] : days[0];
  } else {
    if (days < 0 ) {
      $scope.dayOne = -1;
    }
  }

})

// .directive('voiceSidebar', function(DataRequestFactory) {
//   return {
//     restrict: 'A',
//     scope: true,
//     template: "<h3>Victim's Voices</h3>"+
//       "<p ng-bind-html='voice.description | safehtml'></p>",
//     link: function(scope, element, attribs) {
//       scope.fact = {};
//       DataRequestFactory.getData('fetch', 'voices/random').then(function(data) {
//         scope.fact = data[0];
//       })
//     }
//   }
// })

.directive('kochFact', function(DataRequestFactory) {
  return {
    restrict: 'A',
    scope: true,
    replace: true,
    template: "<div class='koch-fact' ng-if='fact'><h3>Koch Fact</h3>"+
      "<p ng-bind-html='fact.description|safehtml'></p></div>",
    link: function(scope, element, attribs) {
      scope.fact = '';
      DataRequestFactory.getData('fetch', 'facts/random').then(function(data) {
        scope.fact = data[0];
      })
    }
  }
})

.directive('worstOffender', function(DataRequestFactory) {
  return {
    restrict: 'A',
    scope: true,
    replace: true,
    template: "<div class='worst-offender' ng-if='offender'><h3>Worst Offender</h3>"+
      "<img width='80px' ng-src='{{offender.photoURL}}'>"+
      "<h4>{{offender.nameFirstLast}}</h4>"+
      "<p ng-bind-html='offender.description|characters:350: false | safehtml'></p><a ui-sref='kochTracker.explore.offenders'>Read More</a></div>",
    link: function(scope, element, attribs) {
      scope.offender = '';
      DataRequestFactory.getData('fetch', 'offenders/random').then(function(data) {
        scope.offender = data[0];
      })
    }
  }
})

.directive('victimsVoice', function(DataRequestFactory) {
  return {
    restrict: 'A',
    scope: true,
    replace: true,
    template: "<div class='victims-voice' ng-if='voice'><h3>Victim's Voice</h3>"+
      "<p><img ng-if='voice.title' class='quote-left' src='/images/graphic-quote-left.png'>"+
      "<span ng-bind-html='voice.description|characters:350: false | safehtml'></span>"+
      "<img ng-if='voice.title' class='quote-right' src='/images/graphic-quote-right.png'></p>"+
      "<div class='text-right'><b ng-if='voice.title'>{{voice.title}} in {{voice.detail}}<br/></b><a ui-sref='kochTracker.explore.voices'>Read More</a></div>"+
      "<div class='text-center'><span share-story-button/></span></div></div>",
    link: function(scope, element, attribs) {
      scope.voice = '';
      DataRequestFactory.getData('fetch', 'voices/random').then(function(data) {
        scope.voice = data[0];
      })
    }
  }
})

