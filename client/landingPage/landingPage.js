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
    $state.go('myApp.main.candidatesView.'+route, {input:item.id,state:item.state});
  }

  $scope.$on('mapInitialized', function(event, map){
    var layerDistricts = new google.maps.FusionTablesLayer({
      query: {
        select: 'col0',
        from: '1FA02SqJieosxH8tlUN7tfRw86knPdhmxGPJW2uU2'
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
        from: '1AgSd7ptS2hw-KuiXAjvJVS-_G1mrEeJGLCp7gcJX'
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
