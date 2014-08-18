'use strict';
angular.module('myApp.main.landingPage', ['ui.router', 'ngMap'])

.config(function ($stateProvider) {
  $stateProvider
    .state('myApp.main.landingPage', {
      url: '/landingPage',
      templateUrl: 'landingPage/landingPage.tpl.html',
      controller: 'SearchController'
    });
})

.controller('SearchController', function($scope, DataRequestFactory, $rootElement, $location, $q, $state){
  $scope.$on('mapInitialized', function(event, map) {
    var layer = new google.maps.FusionTablesLayer({
      query: {
        select: '\'Geocodable address\'',
        from: '1mZ53Z70NsChnBMm-qEYmSDOvLXgrreLTkQUvvg'
      }
    });
    layer.setMap(map);
  });
  // $scope.fusionLayer = function(map){
  //   debugger;
 
  // }
  $scope.search = function(){
    // DataRequestFactory.redirectPath;
    //<------------this is for sending data to the server---->
  	  // var input = $scope.searchInput;
      //  console.log('This is the search input: ', $scope.searchInput);
      //  DataRequestFactory.getData(input, function(path){
      //    // $state.go(path);
      //  });
  };

  $scope.message = 'Search for a zip code / candidate / organization below';
  
  //this function gets the current location of the user and saves it as $scope.position
  // $scope.getLocation = function(){
  //   $window.navigator.geolocation.getCurrentPosition(function(position, error){
  //     console.dir(position);   
  //       $scope.position = position;
  //       // $scope.findDistrictByLongLat();
  //       if(error){ console.log(error)};
  //     }
  //  )}();

});