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
    return $http.get('/dataRequest/search/'+value).then(function(res) { 
      return res.data;
    });
    // console.log($scope.result)
    // var fullInput = $scope.result.originalObject.fullName;
    // var zipInput = $scope.zipresult.originalObject.zip;
  }

  $scope.select = function(item, model, label) { 
    if (item.type == 'c') { 
      $state.go('myApp.main.candidateProfile', {id:item.id,});
    } else {
      $state.go('myApp.main.candidateList', {input:item.id});
    }
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

