angular.module('myApp.main.landingPage', ['ui.router'])

.config(function ($stateProvider) {
  $stateProvider
    .state('myApp.main.landingPage', {
      url: '/landingPage',
      templateUrl: 'landingPage/landingPage.tpl.html',
      controller: 'SearchController'
    })
})

.controller('SearchController', function($scope, $window, DataRequestFactory){
  
  $scope.search = function(){
  	var input = $scope.searchInput;
  	console.log("input variable in the search controller:" + input);
    DataRequestFactory.getData(input);
    $scope.searchInput = "";
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