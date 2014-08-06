angular.module('myApp.main.landingPage', ['ui.router'])

.config(function ($stateProvider) {
  $stateProvider
    .state('myApp.main.landingPage', {
      url: '/landingPage',
      templateUrl: 'landingPage/landingPage.tpl.html',
      controller: 'SearchController'
    })
})

.controller('SearchController', function($scope, DataRequestFactory, $rootElement, $location, $q, $state){
  
  $scope.search = function(){
    DataRequestFactory.redirectPath;
  	var input = $scope.searchInput;
  	console.log("input variable in the search controller:" + input);
    DataRequestFactory.getData(input, function(path){
      console.log(path);
      $location.path(path);
      // $state.go(path);
      // $location.path("/myApp/main/candidateList");
      console.log(path);
    }) 
  }

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

})