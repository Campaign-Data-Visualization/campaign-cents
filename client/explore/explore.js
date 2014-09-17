'use strict';
angular.module('kochTracker.explore', ['ui.router', 'ngMap'])

.config(function ($stateProvider) {
  $stateProvider
    .state('kochTracker.explore', {
      url: '/explore',
      abstract: true,
      templateUrl: 'explore/explore.tpl.html',
    })
    .state('kochTracker.explore.landing', {
      url: '',
      templateUrl: 'explore/explore.landing.tpl.html',
    })
    .state('kochTracker.explore.map', {
      url: '/map/:state',
      templateUrl: 'explore/explore.map.tpl.html',
      controller: 'ExploreMapController'
    })
    .state('kochTracker.explore.voices', {
      url: '/VictimsVoices',
      templateUrl: 'explore/explore.voices.tpl.html',
      controller: 'ExploreVoicesController'
    })
    .state('kochTracker.explore.offenders', {
      url: '/WorstOffenders',
      templateUrl: 'explore/explore.offenders.tpl.html',
      controller: 'ExploreOffendersController'
    })
    .state('kochTracker.explore.candidates', {
      url: '/KochCandidates',
      templateUrl: 'explore/explore.candidates.tpl.html',
      controller: 'ExploreCandidatesController'
    })
    .state('kochTracker.explore.orgs', {
      url: '/OrgsToWatch',
      templateUrl: 'explore/explore.orgs.tpl.html',
      controller: 'ExploreOrgsController'
    })
    .state('kochTracker.explore.races', {
      url: '/KeyRaces',
      templateUrl: 'explore/explore.races.tpl.html',
      controller: 'ExploreRacesController'
    })
})

.controller('ExploreMapController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state, $stateParams, $templateCache, $compile, $filter){
  console.log('map control');
  $scope.state = $stateParams.state;
  $scope.makers = {};
  $scope.boundaries = {};
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

  $scope.template;


  $http.get('explore/explore.infoWindow.tpl.html', {cache: true}).success(function(html) {
    $templateCache.put('explore.infoWindow.tpl.html', html)
    $scope.template = $templateCache.get('explore.infoWindow.tpl.html');
  });

  $scope.mapStyle = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}]
  
  if ($scope.state) {
    DataRequestFactory.getData("states", $scope.state).then(function(data){
      $scope.boundaries = data[0];
    })
  }

  $scope.toggleLayer = function(layer) {
    var visible = $scope.layers[layer].visible;
    angular.forEach($scope.layers[layer].markers, function(m){
      m.setVisible(visible);
    })
  };

  $scope.showInfoWindow = function(marker, item) {
    $scope.item = item;
    $scope.infoWindow.close();

    var content = $compile($scope.template)($scope)[0];
    $scope.$apply(function() {
      $scope.infoWindow.setContent(content);
      $scope.infoWindow.open($scope.map, marker);
    });
    
  }

  $scope.topoJson;
  $.getJSON("lib/us-states.json", function(data) { $scope.topoJson = data; })
  
  $scope.$on('mapInitialized', function(event, map){
    $scope.$watch('topoJson', function() {
      if ($scope.topoJson) {
        var state_boundary = $.grep($scope.topoJson.objects.usa.geometries, function(i) { return i.id == $scope.state;});
        var geoJsonObject = topojson.feature($scope.topoJson, state_boundary[0]);
        map.data.addGeoJson(geoJsonObject);
        map.data.setStyle({
         // fillColor: '#fff', 
          'fillOpacity':0, 
          strokeColor:'#0071BC'
        })
      }
    })
    $scope.$watch("boundaries.ne_lat", function(n, o) { 
      if ($scope.boundaries.ne_lat) {
        var bounds = new google.maps.LatLngBounds(new google.maps.LatLng($scope.boundaries.sw_lat, $scope.boundaries.sw_lng), new google.maps.LatLng($scope.boundaries.ne_lat, $scope.boundaries.ne_lng));
        $scope.map.fitBounds(bounds);
      }
    })

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
              strokeWeight: 1
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

})

.controller('ExploreVoicesController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state, $stateParams){
  $scope.voices = {};
  DataRequestFactory.getData('fetch', 'voices/all').then(function(data) {
    $scope.voices = data;
  });
})

.controller('ExploreOffendersController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state, $stateParams){
  $scope.offenders = {};
  DataRequestFactory.getData('fetch', 'offenders/all').then(function(data) {
    $scope.offenders = data;
  });
})

.controller('ExploreCandidatesController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state, $stateParams){
  $scope.candidates = {};
  DataRequestFactory.getData('fetch', 'kochCandidates/all').then(function(data) {
    $scope.candidates = data;
  });
})

.controller('ExploreOrgsController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state, $stateParams){
})

.controller('ExploreRacesController', function($scope, $http, DataRequestFactory, $rootElement, $location, $q, $state, $stateParams){
})

.directive('shareStoryButton', function(DataRequestFactory, $modal, $messages) {
  return {
    restrict: 'A',
    replace:true,
    scope: true,
    template: "<button class='btn btn-default' ng-click='showForm()'>Share your story</button>",
    link: function(scope, elem, attrs){
      scope.showForm = function() {
        var modalInstance = $modal.open({
          windowClass: 'share-story-modal share-story-form',
          templateUrl: "/explore/explore.shareStoryForm.tpl.html",
          controller: function($scope, $modalInstance){
            $scope.forms = {};
            $scope.formData = {
              name: '',
              email: '',
              city: '',
              state: '',
              story: '', 
            }
            $scope.close = function() {
              $modalInstance.close();
            }
            $scope.invalid = false;
            $scope.success = false;
            $scope.loading = false;

            $scope.share = function() {
              $messages.clearMessages();
              $messages.modal = true;

              $scope.invalid = $scope.forms.shareStory.$invalid;
              if (! $scope.invalid) {
                $scope.loading = true;
                DataRequestFactory.postData('shareStory', $scope.formData).then(function(data){
                  $scope.loading = false;
                  if (data == 'Success') {
                    $scope.success = true;
                    $messages.modal = false;
                  }
                }, function(e) { 
                  $scope.loading = false;
                })
              }
            }
          }
        });
      }
    }
  }
})
