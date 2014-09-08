'use strict';
angular.module('myApp.main.explore', ['ui.router', 'ngMap'])

.config(function ($stateProvider) {
  $stateProvider
    .state('myApp.main.explore', {
      url: '/explore/:state',
      templateUrl: 'explore/explore.tpl.html',
      controller: 'ExploreController'
    });
})

.controller('ExploreController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state){

  $scope.mapData;
  $scope.makers = {};
  $scope.layers = {
    'candidate': {
      fillColor: 'orange',
      visible: true,
      markers: [],
      label: 'Candidates'
    },
    'campus': {
      fillColor: 'green',
      visible: true,
      markers: [],
      label: 'Campuses'
    },
    'assets': {
      fillColor: 'blue',
      visible: true,
      markers: [],
      label: 'Assets'
    },
  }

  $scope.toggleLayer = function(layer) {
    var visible = $scope.layers[layer].visible = ! $scope.layers[layer].visible;
    angular.forEach($scope.layers[layer].markers, function(m){
      m.setVisible(visible);
    })
  };

  $scope.showInfoWindow = function(marker, item) {
    //This is terrible - hopefully ater I can move this into a directive with an external template.
    $scope.infoWindow.close();
    var content = '';
    if (item.layer == 'candidate') {
      content = "<img style='width: 50px; float: left; margin-right: 10px;' src='http://votesmart.org/canphoto/"+item.id+".jpg'/>"+
                "<h3>"+item.title+"</h3>"+
                "<div style='clear: both'>$"+item.amount+ " from Koch since 2000</div>";
    } else { 
      content = "<h3>"+item.title+"</h3>";
      if (item.description) {
        content += '<div>'+item.description+'</div>';
      }
    }
    $scope.infoWindow.setContent(content);
    $scope.infoWindow.open($scope.map, marker);
  }
  
  $scope.$on('mapInitialized', function(event, map){
    $scope.infoWindow = new google.maps.InfoWindow(); 
      DataRequestFactory.getData('map', 'layers').then(function(data) {
        data.forEach(function(item) {
          var loc = new google.maps.LatLng(item.lat, item.lng);
          var marker = new google.maps.Marker({
            id: item.id,
            title: item.title,
            position: loc,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4,
              fillColor: $scope.layers[item.layer].fillColor,
              fillOpacity: 1,
              strokeColor: 'black',
              strokeWeight: '1'
            },
            map: $scope.map,
          });
          $scope.layers[item.layer].markers.push(marker);
          google.maps.event.addListener(marker, 'click', function() {
            $scope.showInfoWindow(marker, item);
          });  
        });
      })
    });
    /*var layerDistricts = new google.maps.FusionTablesLayer({
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
    });*/
    /*
    var layerKochRecipients = new google.maps.FusionTablesLayer({
      query: {
        select: 'col6',
        from: '1AgSd7ptS2hw-KuiXAjvJVS-_G1mrEeJGLCp7gcJX'
      }
    });*/

    //layerDistricts.setMap(map);
    //layerKochRecipients.setMap(map);
    //});

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
