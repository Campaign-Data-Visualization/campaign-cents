'use strict';
var app = angular.module('kochTracker')

app.directive('messages', function($messages) {
  return {
    restrict: 'A',
    scope: {
    	modal: '=?',
    },
    template: "<div ng-if='modal == messageService.modal'><alert class='message' type='{{message.type}}' close='close($index)' ng-repeat='message in messageService.messages'><div>{{message.message}}</div></alert></div>",
    link: function(scope, element, attribs) { 
      scope.messageService = $messages;
      scope.close = $messages.deleteMessage;
      scope.modal = scope.modal || false;
    }
  }
});

app.directive('loading', function() {
  return {
    restrict: 'E',
    scope: {
          loading: '=',
      },
    template: "<div ng-show='loading' class='loading-image'>[Insert loading image here]</div>",
  };
});

app.directive('insetMap', function($window, $state) {
	return {
	  restrict: 'A',
	  scope: {
	  	state: '='
	  },
	  template: "<div class='inset-map'><svg></svg></div>",
	  link: function(scope, elem, attrs){
		  var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);
      var width = elem.width();
      var height = width * .6
      var current_state = '';

      svg.attr({
      	width: width,
      	height: height
      })
      
      var projection = d3.geo.albersUsa()
      	.scale(1)
      	.translate([0,0])
    	
    	var path = d3.geo.path().projection(projection);

      d3.json("/lib/us-states.json", function(json) {
      	var boundary = $.grep(json.objects.usa.geometries, function(e){ return e.id == scope.state;})[0];
	      var bounds = path.bounds(topojson.feature(json,boundary)),
					dx = bounds[1][0] - bounds[0][0],
					dy = bounds[1][1] - bounds[0][1],
					x = (bounds[0][0] + bounds[1][0]) / 2,
					y = (bounds[0][1] + bounds[1][1]) / 2,
					scale = .9 / Math.max(dx / width, dy / height),
					translate = [width / 2 - scale * x, height / 2 - scale * y];
				
				projection.scale(scale).translate(translate);

	 			var states = svg.append('g').attr('class', 'states').selectAll('.state-boundaries').data(json.objects.usa.geometries)
	 			states.enter().append("path")
					.attr("class", function(d) { 
						var selected = d.id == scope.state ? ' selected ': '';
						return selected+"state-boundaries state-"+d.id; 
					})
					.datum(function(d, i){ return topojson.feature(json, json.objects.usa.geometries[i]) })
					.attr("d", path)
	      
				$('.states')[0].appendChild($('.state-'+scope.state)[0]);
			});
    	svg.on('click', function() {
    		$state.go('kochTracker.explore.map', {state:scope.state});
    	})
    	
    	function resize() {
  	    width = parseInt(d3.select('#map').style('width'));
  	    height = width * .6;

  	    // update projection
  	    projection
	        .translate([width / 2, height / 2])
	        .scale(width * 1.3);

  	    // resize the map container
  	    svg
	        .style('width', width + 'px')
	        .style('height', height + 'px');

  	    // resize the map
  	    svg.selectAll('.state-boundaries').attr('d', path);
    	}
    }
  }
})


app.directive('staticMap', function($window, DataRequestFactory, $state) {
	return {
	  restrict: 'A',
	  scope: true,
	  template: "<div class='static-map'><svg></svg></div>",
	  link: function(scope, elem, attrs){
		  var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);
      var width = elem.width();
      var height = width * .6
      var current_state = '';

      svg.attr({
      	width: width,
      	height: height
      })

      var projection = d3.geo.albersUsa()
      	.scale(width*1.3) //not sure why I need to augment the scale...
      	.translate([width / 2, height / 2])
      var path = d3.geo.path().projection(projection)
      var state_group = svg.append('g').attr('class', 'states');
      var marker_group = svg.append('g').attr('class', 'map-markers')

      d3.json("/lib/us-states.json", function(json) {
	 			var states = state_group.selectAll('.state-boundaries').data(json.objects.usa.geometries,  function(d) { return d.id; })
	 			states.enter().append("path")
					.attr("class", function(d) { return "state-boundaries state-"+d.id; })
					.datum(function(d, i){ return topojson.feature(json, json.objects.usa.geometries[i]) })
					.attr("d", path)
					.style('pointer-events','all')
					.on('mouseenter', function(d) {
						var selected =  d3.selectAll('.state-boundaries.selected');
						angular.forEach(selected, function(s) {
							if ($(s)) {
								d3.selectAll(s).classed('selected', false)
							}
						})
						states.sort(function(a, b) { if (a.id == d.id) { return 1; }})
						d3.select(this).classed('selected', true);
					})
					.on('mouseleave', function(d) {
						if (! d3.event.relatedTarget || d3.event.relatedTarget.tagName != 'circle'){
							d3.select(this).classed('selected', false)
						}
					})
					.on('click', function(d) {
						$state.go('kochTracker.explore.map', {state:d.id});
					})
			});
    	
    	DataRequestFactory.getData('map', 'summary').then(function(data) {
				var markers = marker_group.selectAll('.marker').data(data)
				markers.enter().append("circle")
					.attr("r",0)
					.attr("transform", function(d) {return "translate(" + projection([d.lng,d.lat]) + ")";})
					.attr('fill-opacity', .8)
					.attr('fill', 'red')
					.attr('class', 'marker')
					.on('click', function(d) {
						$state.go('kochTracker.explore.map', {state:d.state});
					})

				markers.transition()
					.duration(700)
					.ease('bounce')
					.delay(function(d, i) { return i * 3; })
					.attr('fill', 'orange')
					.attr('r', 5)
      });

    	scope.$on('windowResize', resize)
    	
    	function resize() {
  	    width = parseInt(d3.select('#map').style('width'));
  	    height = width * .6;

  	    // update projection
  	    projection
	        .translate([width / 2, height / 2])
	        .scale(width * 1.3);

  	    // resize the map container
  	    svg
	        .style('width', width + 'px')
	        .style('height', height + 'px');

  	    // resize the map
  	    svg.selectAll('.state-boundaries').attr('d', path);
  	    svg.selectAll('.marker').attr("transform", function(d) {return "translate(" + projection([d.lng,d.lat]) + ")";})
    	}
    }
  }
})

app.directive('resize', function($window) {
  return {
    link: function(scope) {
      angular.element($window).on('resize', function(e) {
        // Namespacing events with name of directive + event to avoid collisions
        scope.$broadcast('windowResize');
      });
    }
  }
});

app.directive('barChart', function($window) {
	return {
	  restrict: 'A',
	  scope: {
	    data: '='
	  },
	  template: "<div class='bar-chart'><svg></svg></div>",
	  link: function(scope, elem, attrs){
	      
      var maxRadius = 65;
      var yValue = maxRadius + 30 + 25;
      
      var pathClass="path";
      var xScale, yScale, xAxisGen, yAxisGen, zScale, amountText, commas;

      var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);
   
   		var width, height, barHeight, oldWidth;

      var init = function() { 
	      oldWidth = width;
	      width = elem.width();
	      height = width * .4
	      barHeight = height - 20;

	      svg.attr({
	      	width: width,
	      	height: height
	      })
	    }
     
      scope.$watch('data', function() {
    		init();
    		drawBarChart();
      });

      scope.$on('windowResize', resize)
      //d3.select(window).on('resize', resize);
    	
    	function resize() {
    		init();
    		if (oldWidth == width) { return; }

    		xScale = d3.scale.ordinal()
    			.rangeRoundBands([0, width-200], .2)
    			.domain(scope.data.map(function(d) { return d.name}))
    		
    		yScale = d3.scale.linear()
    		  .domain([0, d3.max(scope.data, function(d) { return d.amount; })])
    		  .range([barHeight, 0]);

    		svg.selectAll('.bar')
	    		.attr({
	    			'x': function(d, i) { return xScale(d.name); },
	    			'width': xScale.rangeBand(),
						'height': function(d) { return barHeight - yScale(d.amount)},
			  		'y' : function(d) { return yScale(d.amount); },
			  	})

		  	svg.selectAll('.label')
			  	.attr({
			  		'x': function(d, i) { return xScale(d.name) + xScale.rangeBand()/2; },
			  		'y' : function(d) { return yScale(barHeight) + 18; },
			  		'width': xScale.rangeBand(),
			  	})

			  svg.selectAll('.key')
			  	.attr({transform: 'translate('+(width-215)+', 20)'});

			  svg.selectAll('.key-item')
			  	.attr('transform', function(d, i) { return 'translate(0, '+ i*30+')'; })
    	}
      //scope.data[3].amount=200000;
      //scope.data[3].name='Young Americans for Liberty'

      function setChartParameters(){
        xScale = d3.scale.ordinal()
        	.rangeRoundBands([0, width-200], .2)
        	.domain(scope.data.map(function(d) { return d.name}))
       
        yScale = d3.scale.linear()
          .domain([0, d3.max(scope.data, function(d) { return d.amount; })])
          .range([barHeight, 0]);

        amountText = function(d, value) { 
          var text = '';
          return '$' + commas(Math.floor(value));
        }

		    commas = function(val){
		  		while (/(\d+)(\d{3})/.test(val.toString())){
		    		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		  		}
		  		return val;
				}

       }

      function drawBarChart() {

      	setChartParameters();

        var barGroup = svg.append("svg:g")
          .attr("class", "bar-group")
          .attr("transform", "translate(0,"+0+")")

       	var bars = barGroup.selectAll(".bar").data(scope.data)

       	bars.enter().append('svg:rect')
	       	.attr({
	       		'x': function(d, i) { return xScale(d.name); },
	       		'y' : barHeight,
	       		'width': xScale.rangeBand(),
	       		'height': 0,
	       		'fill': 'red',
	       		'class': function(d, i) { return 'bar bar-'+i; }
	       	})

       	bars.transition()
       		.delay(function(d, i) { return i * 200; })
       		.duration(500)
       		.attr({
       			'height': function(d) { return barHeight - yScale(d.amount)},
         		'y' : function(d) { return yScale(d.amount); },
       		})

       	var labelGroup = svg.append("svg:g")
       		.attr('class', 'labels')

     		var labels = labelGroup.selectAll('.label').data(scope.data)

     		labels.enter().append('svg:text')
     			.attr({
     				'x': function(d, i) { return xScale(d.name) + xScale.rangeBand()/2; },
     				'y' : function(d) { return yScale(barHeight) + 18; },
     				'width': xScale.rangeBand(),
     				'class': function(d, i) {return 'label label-'+ i; },
     				'text-anchor': 'middle',
     			})

     		labels.transition()	
 					.delay(function(d, i) { return i * 200; })
     			.duration(500)
        	.tween('text', function(d) { 
            var i = d3.interpolate(this.textContent.replace(/[^0-9]+/g, ''), d.amount);
            return function(t) { 
              this.textContent = amountText(d, i(t));
            }
        	})	

        var keyGroup = svg.append('svg:g')
        	.attr({
        		'class':'key',
        		transform: 'translate('+(width-215)+', 20)',
        	})


        var keyItems = keyGroup.selectAll('.key-item').data(scope.data, function(d) { return d.name})
        keyItems.enter().append('svg:g')
        	.attr({
        		'class':'key-item',
 						'transform': function(d, i) { return 'translate('+(width-420)+', '+ (i*30)+')'; },
        	})

        keyItems.transition()
         	.ease('elastic')
          .delay(function(d, i) { return i * 200; })
         	.duration(500)
         	.attr('transform', function(d, i) { return 'translate(0, '+ i*30+')'; })
       
       	keyItems.append('rect')
       		.attr({
       			'class': function(d, i) { return 'key-swatch key-'+i; },
       			width: 20,
       			height: 20,
       			x: 0,
       			y: -20,
   				})

        keyItems.append('svg:text')
        	.attr({
        		'class': 'key-text',
        		//'width': 150,
        		'x': 25,
        		'y': -9,
        		'dominant-baseline': 'middle'
        	})
        	.text(function(d) { return d.name})
      }
    }
  }
});

app.directive('bubbleChart', function($window) {
  return {
    restrict: 'A',
    scope: {
      data: '='
    },
    template: "<div class='bubble-chart'>"+
    	"<div class='bubble-label'>2014 Spending <span tooltip='Tier 1 organizations consist of: •    Koch-owned business, such as Koch Industries and Flint Hills resources •    Political organizations with very close ties to the Kochs, i.e. they founded the company or sit on the board. Examples include Americans for Prosperity and Club for Growth •    Koch-owned or founded think tanks, such as the Cato Institute. Not many donations from these are included in our data. •    Any organization to which the Koch brothers have donated over one million dollars since 2008 Tier 2 organizations consist of: •    Any organization that receives considerable funding from the Koch brothers that totals less than one million dollars.'>[?]</span></div>"+
    	"<svg>"+
    	"<filter id='glow' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='1 1' result='glow'/><feMerge><feMergeNode in='glow'/><feMergeNode in='glow'/><feMergeNode in='glow'/></feMerge></filter>"+
    	"</svg></div>",
    link: function(scope, elem, attrs){
      
      var maxRadius = 65;
      var yValue = maxRadius + 30 + 25;
      
      var labels =  ["Tier One", 'Tier Two', 'Prior Years', 'Lifetime Total'];

      var pathClass="path";
      var xScale, yScale, xAxisGen, yAxisGen, zScale, amountText, commas;

      var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);

   		var width, height, barHeight, oldWidth;

      var init = function() { 
	      oldWidth = width;
	      width = elem.width();
	      height = width * .4
	      barHeight = height - 20;

	      svg.attr({
	      	width: width,
	      	height: height
	      })
	    }
     
      scope.$watch('data', function() {
    		init();
    		drawBubbleChart();
      });

      scope.$on('windowResize', resize)
      	
    	function resize() {
    		init();
    		if (oldWidth == width) { return; }

        xScale = d3.scale.linear()
          .domain([0, 3])
          .range([maxRadius, width - maxRadius]);
       
        zScale = d3.scale.sqrt()
	        .domain([0, d3.max(scope.data, function(d) { return d; })])
	        .range([0, 65]);

        svg.selectAll("circle")
        	.attr({
      			cx: function(d, i) { return xScale(i); },
						r: function(d) { return zScale(d); }
					})

				svg.selectAll('.amount')
					.attr('x',function(d, i) { return xScale(i); })

				svg.selectAll('.amount-shadow')
					.attr('x',function(d, i) { return xScale(i); })	
				
				svg.select('.axis')
					.call(xAxisGen.scale(xScale))
    	}

      function setChartParameters(){
        xScale = d3.scale.linear()
          .domain([0, 3])
          .range([maxRadius, width - maxRadius]);
       
        zScale = d3.scale.sqrt()
	        .domain([0, d3.max(scope.data, function(d) { return d; })])
	        .range([0, 65]);

        xAxisGen = d3.svg.axis()
	        .scale(xScale)
	        .orient("top")
	        .ticks(scope.data.length)
	        .tickValues([0, 1, 2,3])
	        .tickFormat(function(d, i) { return labels[i]; })
	        .innerTickSize(maxRadius + 30)

        amountText = function(d, value) { 
          var text = '';
          return '$' + commas(Math.floor(value));
        }

		    commas = function(val){
		  		while (/(\d+)(\d{3})/.test(val.toString())){
		    		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		  		}
		  		return val;
				}
       }
    
      function drawBubbleChart() {

        setChartParameters();

        svg.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0,"+(yValue)+")")
          .call(xAxisGen)

        var circle = svg.selectAll("circle").data(scope.data)
        
        circle.enter().append("svg:circle")
          .attr({
            r: 0,
            cx: function(d, i) { return xScale(i); },
            cy: yValue,
            "class": function(d, i) { return 'bubble bubble-'+i; }
          });

        circle.transition()
        	.ease('elastic')
          .duration(1000)
          .delay(function(d, i) { return i * 200; })
          .attr('r', function(d) { return zScale(d); })
                 
        svg.append('g').attr('class', 'amounts');

        var amounts_group = svg.selectAll('g.amounts')

        var amounts = amounts_group.selectAll('text')
          .data(scope.data);

         amounts.enter().append('text')
	      	.attr('x',function(d, i) { return xScale(i); })
          .attr('class','chart-label amount-shadow')
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor','middle')
          .attr('y', yValue)

        amounts.enter().append('text')
        	.attr('x',function(d, i) { return xScale(i); })
          .attr('class','chart-label amount')
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor','middle')
          .attr('y', yValue)

        amounts_group.selectAll('text').transition()
          .duration(1000)
          //.delay(function(d, i) { return (i > 3 ? i-3 : i) * 200; })
          .tween('text', function(d) { 
            var i = d3.interpolate(this.textContent.replace(/[^0-9]+/g, ''), d);
            return function(t) { 
              this.textContent = amountText(d, i(t));
            }
          })
      } 
   }
 }
})

app.directive('searchBox', function(DataRequestFactory, $state) {
  return {
    restrict: 'E',
    scope: true,
    template: "<div class='search-box-container'>"+
      "<input type='text' ng-model='searchValue' placeholder='Candidate Name or Zipcode' typeahead='result.label as result for result in search($viewValue)' typeahead-template-url='common/search-results.tpl.html' typeahead-loading='loadingSearch' typeahead-editable='false' class='form-control search-box' typeahead-on-select='select($item, $model, $label)'>"+
      "<button class=' btn btn-md btn-detault searchButton' type='submit' ng-click='search()'>Search</button></div>"+
      "<div ng-show='loadingSearch'>Insert Loading Indicator</div>",
    link: function(scope, element, attribs) {
      scope.searchValue = '';
      scope.loadingSearch = false;

      scope.search = function(value) {
        //scope.loadingSearch = true;
        return DataRequestFactory.getData('search', value).then(function(res) { 
          //scope.loadingSearch = false;
          if (! res[0]) {
            return [{err:'none'}];
          } else { 
            return res;
          }
        }, function(err){
          //scope.loadingSearch = false;
          return [{err:'error'}];
        });
      };

      scope.select = function(item, model, label) {
        if (item.err) { 
          scope.searchValue = '';
          return; 
        } else {
          var route = item.type == 'c' ? 'candidateProfile' : 'candidateList';
          $state.go('kochTracker.candidatesView.'+route, {input:item.id,state:item.state});
        }
      }
    }
  };
});
