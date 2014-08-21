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
  
  $scope.search = function(){
    // DataRequestFactory.redirectPath;
    //<------------this is for sending data to the server---->
      // var input = $scope.searchInput;
      //  console.log('This is the search input: ', $scope.searchInput);
      //  DataRequestFactory.getData(input, function(path){
      //    // $state.go(path);
      //  });
  };

  $scope.$on('mapInitialized', function(event, map) {
    // Adding test comment
    var layerDistricts = new google.maps.FusionTablesLayer({
        query: {
          select: 'col0',
          from: '1BAwVHJLmofCdgz3ewBHN_42SHqjK7VV3sfek26Fm'
        }
      });
    var layerKochRecipients = new google.maps.FusionTablesLayer({
      query: {
        select: 'col6',
        from: '1yD-ZmXy4Lgo4DC9-HmvwxYcvcYfIDzZdNpJEKvtx'
      }
    });
  
    layerDistricts.setMap(map);
    layerKochRecipients.setMap(map);
    });

  $scope.message = 'Search for a zip code / candidate';
  
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