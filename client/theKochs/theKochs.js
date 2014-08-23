'use strict';
angular.module('myApp.main.theKochs', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('myApp.main.theKochs', {
      url: '/theKochs',
      templateUrl: 'theKochs/theKochs.tpl.html',
      controller: 'TheKochsController'
    });
})
.controller('TheKochsController', function ($scope) {
  //$scope.message = 'Check out this org profile. So so dirty.';
  //$scope.org = 'Americans for Prosperity';
  //$scope.profile = "Swag messenger bag tattooed, Banksy ethical dreamcatcher freegan skateboard street art ennui next level DIY beard High Life. Blue Bottle cliche small batch freegan. Banjo pop-up freegan High Life typewriter. Tumblr keffiyeh organic cornhole selfies kitsch lomo, tattooed Thundercats put a bird on it. Master cleanse pop-up direct trade, hashtag you probably haven't heard of them twee butcher before they sold out Truffaut. Try-hard synth freegan tote bag, photo booth ethical +1 Helvetica. PBR&B XOXO deep v cornhole meh freegan.";
  //$scope.tierOne = 12000;
  //$scope.tierTwo = 28599;
});
