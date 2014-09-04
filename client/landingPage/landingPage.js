'use strict';
angular.module('myApp.main.landingPage', ['ui.router', 'ngMap'])

.config(function ($stateProvider) {
  $stateProvider
    .state('myApp.main.landingPage', {
      url: '',
      templateUrl: 'landingPage/landingPage.tpl.html',
      controller: 'LandingPageController'
    });
})

.controller('LandingPageController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state){
  $scope.dayOne = 0;
  $scope.dayTwo = 0;
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
  //console.log(days);

  $scope.$on('mapInitialized', function(event, map){
    $scope.infoWindow = new google.maps.InfoWindow(); 
    
    DataRequestFactory.getData('map', 'candidates').then(function(data) {
      $scope.markers = [];
      data.forEach(function(can) {
        var loc = new google.maps.LatLng(can.lat, can.lng);
        var marker = new google.maps.Marker({
          id: can.id,
          title: can.title,
          position: loc,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: 'orange',
            fillOpacity: 1,
            strokeColor: 'black',
            strokeWeight: '1'
          },
          map: $scope.map
        });
        google.maps.event.addListener(marker, 'click', function() {
          $scope.infoWindow.close();
          $scope.infoWindow.setContent(
            "<img style='width: 50px; float: left; margin-right: 10px;' src='http://votesmart.org/canphoto/"+marker.id+".jpg'/>"+
            "<h3>"+marker.title+"</h3>"+
            "<div style='clear: both'>$"+can.amount+ " from Koch since 2000</div>"
          );
          $scope.infoWindow.open($scope.map, marker)
        });  
      })
    });
    var layerDistricts = new google.maps.FusionTablesLayer({
      query: {
        select: 'col0',
        from: '1Z90J8WgY8rdB_TCNS_EynPye4CazNoZK4XfENz_z'
      },
      styles: [{
        polygonOptions: {
          fillColor: '#F0F0F0',
          fillOpacity: 0.5
        }
      }],      
      clickable: false,
      suppressInfoWindows: true      
    });
    /*var layerKochRecipients = new google.maps.FusionTablesLayer({
      query: {
        select: 'col6',
        from: '1AgSd7ptS2hw-KuiXAjvJVS-_G1mrEeJGLCp7gcJX'
      }
    });*/

    layerDistricts.setMap(map);
    //layerKochRecipients.setMap(map);
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
