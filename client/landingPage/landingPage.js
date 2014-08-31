'use strict';
angular.module('myApp.main.landingPage', ['ui.router', 'ngMap'])

.config(function ($stateProvider) {
  $stateProvider
    .state('myApp.main.landingPage', {
      url: '',
      templateUrl: 'landingPage/landingPage.tpl.html',
      controller: 'SearchController'
    });
})

.controller('SearchController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state){

  $scope.zipsearchshow = false;
  $scope.searchValue = '';
  $scope.loadingSearch = false;

  $scope.search = function(value){
    return DataRequestFactory.getData('search', value).then(function(res) { 
      return res;
     });
  }

  $scope.select = function(item, model, label) { 
    var route = item.type == 'c' ? 'candidateProfile' : 'candidateList';
    $state.go('myApp.main.'+route, {input:item.id,});
  }

  $scope.$on('mapInitialized', function(event, map){
    var layerDistricts = new google.maps.FusionTablesLayer({
      query: {
        select: 'col0',
        from: '1BAwVHJLmofCdgz3ewBHN_42SHqjK7VV3sfek26Fm'
      },
      styles: [{
        polygonOptions: {
          fillColor: '#F0F0F0',
          fillOpacity: 0.5
        }
      }]      
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
