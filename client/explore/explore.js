'use strict';
angular.module('kochTracker.explore', ['ui.router', 'ngMap'])

.config(['$stateProvider', function ($stateProvider) {
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
}])

.controller('ExploreMapController', ['$scope', '$rootScope', '$http', 'DataRequestFactory', '$stateParams', '$templateCache', '$compile', function($scope, $rootScope, $http, DataRequestFactory, $stateParams, $templateCache, $compile){
  $rootScope.title = 'KochProblem.org - Explore - National Map';
  $scope.state = $stateParams.state;
  $scope.makers = {};
  $scope.boundaries = {};
  $scope.layers = {
    'candidate': {
      fillColor: '#89272d',
      visible: true,
      markers: [],
      label: 'Candidates'
    },
    'campus': {
      fillColor: '#f17522',
      visible: true,
      markers: [],
      label: 'Campuses'
    },
    'assets': {
      fillColor: '#004e70',
      visible: true,
      markers: [],
      label: 'Assets'
    },
    'action': {
      fillColor: '#6baf00',
      visible: true,
      markers: [],
      label: 'Take Action'
    },
  }

  $scope.layersOrder = ['candidate', 'campus', 'action', 'assets'];

  $scope.template;

  $http.get('explore/explore.infoWindow.tpl.html', {cache: true}).success(function(html) {
    $templateCache.put('explore.infoWindow.tpl.html', html)
    $scope.template = $templateCache.get('explore.infoWindow.tpl.html');
  });

  $scope.mapStyle = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}]
  
  if ($scope.state) {
    DataRequestFactory.getData("states", $scope.state).then(function(data){
      $scope.boundaries = data;
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

    var content = $($compile($scope.template)($scope)[0]);
    $scope.$apply(function() {
      $scope.infoWindow.setContent(content[0]);
      $scope.infoWindow.open($scope.map, marker);
      $scope.infoWindow.border = marker.icon.fillColor;
      $scope.infoWindow.setContent(content[0]); //add content again to try and force window to size right
    });
    
  }

  $scope.topoJson;
  $.getJSON("lib/us-states.json", function(data) { $scope.topoJson = data; })
  
  $scope.$on('mapInitialized', function(event, map){
    $scope.$watch('topoJson', function() {
      if ($scope.topoJson && $scope.state) {
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
    google.maps.event.addListener($scope.infoWindow, 'domready', function(){
      $('#map > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(4) > div > div:nth-child(1) > div:nth-child(4)').css({'border': '4px solid '+$scope.infoWindow.border})
    })

    DataRequestFactory.getData('map', 'layers').then(function(data) {
      data.forEach(function(item) {
        var loc = new google.maps.LatLng(item.lat, item.lng);
        var marker = new google.maps.Marker({
          id: item.id,
          tooltip: item.title,
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
        google.maps.event.addListener(marker, 'mouseover', function () {
            var offset =  $('.google-maps').offset();
            var point = fromLatLngToPoint(marker.getPosition(), map);
            $('#marker-tooltip').html(marker.tooltip).css({ 'left': point.x+offset.left, 'top': point.y+offset.top, 'backgroundColor': marker.icon.fillColor }).show();
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            $('#marker-tooltip').hide();

        });
      });
    })
  });

  var fromLatLngToPoint = function(latLng, map) {
    var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
    var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
    var scale = Math.pow(2, map.getZoom());
    var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
    return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
  }
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

}])

.controller('ExploreVoicesController', ['$scope', '$rootScope', 'DataRequestFactory', function($scope, $rootScope, DataRequestFactory){
  $rootScope.title = "KochProblem.org - Explore - Victim's Voices";
  $scope.voices = {};
  DataRequestFactory.getData('fetch', 'voices/all').then(function(data) {
    $scope.voices = data;
  });
}])

.controller('ExploreOffendersController', ['$scope', '$rootScope', 'DataRequestFactory', function($scope, $rootScope, DataRequestFactory){
  $rootScope.title = "KochProblem.org - Explore - Worst Offenders";
  $scope.offenders = {};
  DataRequestFactory.getData('fetch', 'offenders/all').then(function(data) {
    $scope.offenders = data;
  });
}])

.controller('ExploreCandidatesController', ['$scope', '$rootScope', 'DataRequestFactory', function($scope, $rootScope, DataRequestFactory){
  $rootScope.title = "KochProblem.org - Explore - Victim's Voices";
  $scope.candidates = {};
  DataRequestFactory.getData('fetch', 'kochCandidates/all').then(function(data) {
    $scope.candidates = data;
  });
}])

.controller('ExploreOrgsController', ['$scope', '$rootScope', 'DataRequestFactory', function($scope, $rootScope, DataRequestFactory){
  $rootScope.title = "KochProblem.org - Explore - Orgs to Watch";
  $scope.orgs = [
    {
      name: 'Americans for Prosperity',
      description: "<b>Americans for Prosperity</b> was founded with the support of Charles and David Koch, and claims that they're fighting for \"<a target='_blank' href='http://americansforprosperity.org/'>economic freedom, limited government and prosperity for all</a>,\" while relying heavily on support from Koch &amp; Co. AFP disburses money to organizations and candidates that promote policies that predominantly benefit the minority of millionaires and billionaires like the Kochs and disenfranchise ordinary American citizens. AFP strongly opposes any legislation that recognizes climate change or attempts to regulate the oil and fossil fuel industries. The Washington Post has called AFP \"<a target='_blank' href='http://www.washingtonpost.com/blogs/the-fix/wp/2014/06/19/americans-for-prosperity-is-americas-third-biggest-political-party/'>America's third-largest political party</a>.\""
    }, {
      name: 'Freedom Partners',
      description: "<b>Freedom Partners</b> has been described by Politico as \"<a target='_blank' href='http://www.politico.com/story/2013/09/behind-the-curtain-exclusive-the-koch-brothers-secret-bank-96669.html#ixzz2hj4y5I8o'>the Koch brothers' secret bank</a>\" because they receive massive multi-million dollar funds from undisclosed donors and give equally enormous sums to other organizations and politicians that advance the Conservative agenda, even going to the extreme of fiscally supporting the Tea Party. It raised $256 million during the 2012 election cycle, and served as the $400 million Koch networks' \"de facto bank\" by \"<a target='_blank' href='http://www.washingtonpost.com/politics/koch-backed-political-network-built-to-shield-donors-raised-400-million-in-2012-elections/2014/01/05/9e7cfd9a-719b-11e3-9389-09ef9944065e_story.html'>feeding money to groups downstream</a>.\" In June 2014, Freedom Partners coordinated an event where there were over 300 people in attendance, all worth about a billion dollars each. In this three-day event, the Freedom Partners PAC was created, and they planned to spend up to<a target='_blank' href='http://www.politico.com/story/2014/06/2014-elections-koch-brothers-super-pac-107926.html'> $290 million</a> in 2014 midterm elections.",
    }, {
      name: 'American Legislative Exchange Council (ALEC)',
      description: "<b>American Legislative Exchange Council (ALEC)</b> is a lobbying group with close ties to Koch, and has been known to relentlessly dispute clean energy businesses and policies that support the evolution of solar and wind technologies. ALEC boasts anti-environmental efforts such as supporting the construction of the Keystone XL pipeline and the movement toward more industry-friendly fracking rules, and opposing any EPA regulations relating to public health and working toward cleaner industries. The group neglects the well-being of the environment and the public in its effort to advance corporate interests.There has also been a claim that ALEC is writing our policies, so in Virginia, a group looked into the depth of ALEC's influence. They found that many of the bills brought up in the state were similar and even in some cases, <a target='_blank' href='http://www.nytimes.com/2012/02/13/opinion/the-big-money-behind-state-laws.html'>word for word</a>, to the model legislations ALEC had drafted.",
    }, {
      name: 'Club for Growth',
      description: "The very name <b>Club for Growth</b> is ironic because rather than promote economic growth, the group endorses and raises money for right-wing candidates who will adhere to the group's vision of limited government, tax reform, and deregulation of government programs. Because the group advances the growth of the pockets of millionaires and billionaires and not of the economy and the average American citizen, it has acquired the nickname \"<a target='_blank' href='http://www.foxnews.com/story/2007/11/19/transcript-mike-huckabee-on-fox-news-sunday/'>Club for Greed</a>.\" It is also unsettlingly dangerous because it is allowed to raise unlimited funds without having to disclose its donors, and has already <a target='_blank' href='http://www.opensecrets.org/orgs/summary.php?id=D000000763'>spent close to $9 million</a> influencing the 2014 midterm elections. In an <a target='_blank' href='http://www.thenation.com/blog/158793/governor-scott-walker-puppet'>article</a> published by The Nation in 2012, Club for Growth was accused of strategizing to get newly elected politicians to destroy unions.",
    }, {
      name: 'Cato Institute',
      description: "<b>Cato Institute</b> is a think tank created by Charles Koch and continues to be funded by the Koch brothers. Cato scholars conduct research on a wide range of issues in public policies. The Institute's <a target='_blank' href='http://mediamatters.org/blog/2012/11/28/meet-the-climate-denial-machine/191545'>only climate change expert</a> has estimated that 40% of his funding comes from the oil industry. He is frequently quoted in the media, but has been criticized by other scientists for misrepresenting their findings and downplaying the threat of climate change. Not only have they had a history of showing allegiance to their funders from the oil business, but also to their friends in the tobacco industry by <a target='_blank' href='http://www.cato.org/publications/congressional-testimony/radley-balkos-dc-city-council-testimony'>downplaying the risks of smoking cigarettes</a>. Thus, the Cato Institute has shown that it favors ideology over science.",
    }, {
      name: 'Generation Opportunity',
      description: "<b>Generation Opportunity</b> is an organization that strives to attract the votes of the millennials, a demographic that the GOP has experienced difficulties connecting with. According to <a target='_blank' href='https://www.google.com/url?q=https://www.opensecrets.org/news/2014/05/genopp-too-another-group-almost-wholly-funded-by-koch-network/'>OpenSecrets</a>, GenOp has received 86% of its funds solely from two Koch-linked groups within the three years of which its tax information is available. This is the organization that is responsible for the <a target='_blank' href='https://www.youtube.com/watch?v=R7cRsfW0Jv8'>disturbing Uncle Sam tv ads</a> which tried to persuade young people to \"opt out\" of the Affordable Care Act. They traveled around to multiple college campuses, where they set up football tailgating areas, gave out free beer and Generation Opportunity merchandise, and took pictures of students \"opting out\" of Obamacare.",
    },{
      name: 'American Energy Alliance',
      description: "<b>American Energy Alliance</b> was founded by <a target='_blank' href='http://americanenergyalliance.org/about/staff/'>Thomas Pyle</a>, a man who had previously been lobbying for the National Petrochemical and Refiners Association and Koch Industries, and it has received <a target='_blank' href='http://www.politico.com/story/2013/09/behind-the-curtain-exclusive-the-koch-brothers-secret-bank-96669.html'>multimillion dollar grants</a> from multiple Koch-linked organizations. The <a target='_blank' href='http://americanenergyalliance.org/about/'>AEA says</a> it's a grassroots affiliate of the Institute for Energy Research (also a Koch-backed organization) and claims that its mission is to encourage consumers to urge policymakers to support free market policies. However, these free market policies only benefit the big-business oil and gas corporations and weaken the opportunities of renewable energy industries.",
    },{
      name: 'Independent Women\'s Forum',
      description: "<b>Independent Women's Forum</b> is an anti-feminist organization funded by right-wing foundations including the Koch brothers' Claude R. Lambe Foundation. From 2003-2008, IWF was linked with Americans for Prosperity. In an editorial from 2013, the New York Times claimed that IWF is \"<a target='_blank' href='http://www.nytimes.com/2013/02/03/opinion/sunday/dangerous-gun-myths.html?_r=0'>a right-wing public policy group that provides pseudofeminist support for extreme positions that are in fact dangerous to women.</a>\" The group opposed the Violence Against Women Act in 2013, and also pushed to eradicate the teaching of global warming from school agendas.",
    },{
      name: '60+',
      description: "<b>60+</b> is an organization that is heavily funded by the Koch brothers, receiving $15.7 from Freedom Partners and $2.6 from American Encore (another group with Koch ties) in 2012. This organization promotes limited government and economic freedom, focusing on the interests of seniors. They opposed the Health Care Reform in 2010 and released television ads that claimed that the Affordable Care Act would make monstrous cuts to Medicare and weaken medical institutions, and in turn, hurting seniors. However, several fact-checking organizations refute 60+'s claim, such as <a target='_blank' href='http://www.politifact.com/truth-o-meter/statements/2010/sep/20/60-plus-association/medicare-cuts-health-care-law-will-hurt-seniors-sa/'>Politifact</a> and Media Matters, yet it still became one of the GOP's favorite attack lines against the act.",
    }
  ];
}])

.controller('ExploreRacesController', ['$scope', '$rootScope', 'DataRequestFactory', function($scope, $rootScope, DataRequestFactory){
  $rootScope.title = "KochProblem.org - Explore - Key Races";
  $scope.races = {};
  DataRequestFactory.getData('fetch', 'races/all').then(function(data) {
    $scope.races = data;
  });
}])

