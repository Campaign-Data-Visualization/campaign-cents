'use strict';
var app = angular.module('kochTracker')

app.directive('messages', function($messages, $filter) {
  return {
    restrict: 'A',
    scope: {
      modal: '=?',
    },
    template: "<div ng-if='modal == messageService.modal'><alert class='message' type='{{message.type}}' close='close($index)' ng-repeat='message in messageService.messages'><div ng-bind-html='message.message | safehtml'></div></alert></div>",
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
          class: '=?'
      },
    template: "<div ng-show='loading' ng-class='{{class}}' class='loading-image text-center'><span class='glyphicon glyphicon-refresh spin'></span></div>",
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
      var height = width * .7;
      var current_state = '';

      svg.attr({
        width: width,
        height: height
      })
      
      var projection = d3.geo.mercator()
        .scale(1)
        .translate([0,0])
      
      var path = d3.geo.path().projection(projection);

      d3.json("/lib/us-states.json", function(json) {
        var boundary = $.grep(json.objects.usa.geometries, function(e){ return e.id == scope.state;})[0];
        var bounds = path.bounds(topojson.feature(json,boundary)),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = scope.state == 'AK' ? -2.7 : (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = scope.state == 'AK' ? 270 : .8 / Math.max(dx / width, dy / height),
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
          .on('mouseenter', function(d) {
             d3.selectAll('.state-'+d.state).classed('selected', true)
          })
          .on('mouseleave', function(d) {
            if (! d3.event.relatedTarget || ( d3.event.relatedTarget.tagName != 'path' && d3.event.relatedTarget.tagName != 'circle')){
             d3.selectAll('.state-boundaries.selected').classed('selected', false)
            }
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
    template: "<div class='bar-chart text-center'><div class='bar-chart-control'>"+
      "<label class='radio-inline'><input type='radio' ng-model='time' value='total'>Total</label>"+
      "<label class='radio-inline'><input type='radio' ng-model='time' value='current'>2014 Cycle</label>"+
      "<label class='radio-inline'><input type='radio' ng-model='time' value='previous'>Prior Years</label>"+
      "</div><svg></svg></div>",
    link: function(scope, elem, attrs){
      
      scope.time = 'total';
      //scope.data[0].total = 15000000;
        
      var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);
   
       var width, height, oldWidth, barWidth, xScale, amountText, commas, wrap;

      var exitDuration = 200,
        transformDuration = 500,
        barHeight = 50,
        barMargin = 5,
        keyWidth = 140,
        keyMargin = 10,
        labelWidth = 100,
        labelMargin = 5;

      var init = function() {
         svg.append("svg:g")
           .attr("class", "bar-group")
           .attr("transform", "translate("+keyWidth+",0)")

         svg.append("svg:g")
           .attr('class', 'labels')
           .attr("transform", "translate("+keyWidth+",0)")

          svg.append('svg:g')
           .attr('class', 'key')
      }

      var setChartParameters = function() {
        oldWidth = width;
        width = elem.width();
        height = (scope.data.length)*barHeight;
        barWidth = width - keyWidth - labelWidth;

        svg.attr({
          width: width,
          height: height
        })

        xScale = d3.scale.linear()
          .domain([0, d3.max(scope.data, function(d) { return d.total; })])
          .range([0, barWidth]);
      }

      var amountText = function(d, value) { 
        var text = '';
        return '$' + commas(Math.floor(value));
      }

      var commas = function(val){
        while (/(\d+)(\d{3})/.test(val.toString())){
          val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
      }

      var wrap = function(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }

      function drawBarChart() {
        setChartParameters();

        var filteredData = scope.data.filter(function(d) { return d[scope.time] != 0; });
        var dataKey = function(d) { return d.name; }

        //BARS
         var bars = svg.select('.bar-group').selectAll(".bar").data(filteredData, dataKey)

         bars.enter().append('svg:rect')
           .attr({
             'y': function(d, i) { return barHeight * i; },
             'x' : 0,
             'width': 0,
             'height': barHeight - barMargin,
             'fill': 'red',
             'class': function(d, i) { return 'bar bar-'+i; }
           })

         bars.transition()
           .delay(!bars.exit().empty()*exitDuration)
           .duration(transformDuration)
           .attr({
             'width': function(d) { return xScale(d[scope.time])},
             'y': function(d, i) { return barHeight * i; },
           })

         bars.exit().transition()
           .duration(exitDuration)
           .attr({
             width: 0,
           })
           .style('opacity','0')
           .remove();

        //LABELS
         var labels = svg.select('.labels').selectAll('.label').data(filteredData, dataKey)

         labels.enter().append('svg:text')
           .attr({
             x: labelMargin,
             y: function(d, i) { return (barHeight * i) + ((barHeight- barMargin)/2); },
             class: function(d, i) {return 'label label-'+ i; },
             'dominant-baseline': 'middle',
             height: barHeight -barMargin
           })
           .style('opacity','0')

         labels.transition()  
           .delay(!labels.exit().empty()*exitDuration)
           .duration(transformDuration)
           .attr({
             x: function(d) { return xScale(d[scope.time]) +labelMargin},
             y: function(d, i) { return (barHeight * i) + ((barHeight-barMargin)/2); },
           })
          .tween('text', function(d) { 
            var i = d3.interpolate(this.textContent.replace(/[^0-9]+/g, ''), d[scope.time]);
            return function(t) { 
              this.textContent = amountText(d, i(t));
            }
          })
           .style('opacity','1')

        labels.exit().transition()
          .duration(exitDuration)
          .attr({
            x: labelMargin,
          })
           .style('opacity','0')
          .remove();

        //KEY

        var keyItems = svg.select('.key').selectAll('.key-item').data(filteredData, dataKey);

        keyItems.enter().append('svg:g')
          .attr({
            'class':'key-item',
             'transform': function(d, i) {
               return 'translate('+(keyWidth-keyMargin)+', '+ (barHeight * i)+')'; },
          })
           .style('opacity','0')
          .append('svg:text')
            .attr({
              'class': 'key-text',
              'y': (barHeight-barMargin)/2,
              'dominant-baseline': 'middle',
              'text-anchor': 'end',
              'width': keyWidth-keyMargin,
              'height': barHeight -barMargin,
              dy: '0em'
            })
            .text(function(d) { return d.name})
            .call(wrap, keyWidth-keyMargin)

        keyItems.transition()
           .delay(!keyItems.exit().empty()*exitDuration)
           .duration(transformDuration)
           .attr('transform', function(d, i) { return 'translate('+(keyWidth-keyMargin)+', '+ (barHeight * i)+')'; })
           .style('opacity','1')

        keyItems.exit().transition()
          .duration(exitDuration)
          .style('opacity','0')
          .remove()
          
      }

      scope.$watch('time', function(a, b) {
        if (a && a != b) {
          drawBarChart();
        }
      })

      scope.$watch('data', function() {
        init();
        drawBarChart();
      });

      scope.$on('windowResize', resize)
      
      function resize() {
        setChartParameters();

        if (oldWidth == width) { return; }

        svg.selectAll('.bar')
          .attr({
             'width': function(d) { return xScale(d[scope.time])},
             'y': function(d, i) { return barHeight * i; },
          })

        svg.selectAll('.label')
          .attr({
             x: function(d) { return xScale(d[scope.time]) +labelMargin},
             y: function(d, i) { return (barHeight * i) + ((barHeight-barMargin)/2); },
          })

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
      "<div class='bubble-label col-xs-6 text-center'><span>2014 Cycle Funding <span info-popup content='{{popupContent}}'></span></span></div>"+
      "<div class='bubble-label col-xs-6 text-center'><span>Prior Year Funding <span info-popup content='{{popupContent}}'></span></span></div>"+
      "<svg><defs>"+
        "<filter id='glow' x='-30%' y='-30%' width='160%' height='160%'>"+
          "<feGaussianBlur stdDeviation='1 1' result='glow'/>"+
          "<feMerge>"+
            "<feMergeNode in='glow' />"+
            "<feMergeNode in='glow' />"+
            "<feMergeNode in='glow' />"+
          "</feMerge>"+
        "</filter>"+
      "</defs>"+
      "</svg></div>",
    link: function(scope, elem, attrs){
      scope.popupContent = "<b>Tier 1 organizations</b> consist of Koch-owned businesses, political organizations with very close ties to the Kochs, Koch-owned or founded think tanks, and any organization to which the Koch brothers have donated over one million dollars since 2008 "+
        "<p><b>Tier 2 organizations</b> consist of any organization that receives considerable funding from the Koch brothers that totals less than one million dollars.</p>";
      
      var maxRadius = 65;
      var yValue = maxRadius + 30 + 25;
      
      var labels =  ["Tier One", 'Tier Two', 'Tier One', 'Tier Two'];

      var xScale, yScale, xAxisGen, yAxisGen, zScale, amountText, commas;

      var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);

      var width, height, barHeight, oldWidth;

      var init = function() { 
        oldWidth = width;
        width = elem.width();
        //height = width * .4
        maxRadius = width > 65 * 8 ? 65 : 45;
        yValue = maxRadius + 30 + 25;

        height = 216
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
          .range([0, maxRadius]);

        svg.selectAll("circle")
          .attr({
            cx: function(d, i) { return xScale(i); },
            r: function(d) { return zScale(d); }
          })
        
        svg.selectAll('.noneback')
          .attr('x', function(d, i) { return xScale(i) - 39; });

				svg.selectAll('.none')
          .attr('x',function(d, i) { return xScale(i); })

        svg.selectAll('image')
          .attr('x',function(d, i) { return xScale(i)-32; })

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
          .range([0, maxRadius]);

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

        var circle = svg.selectAll("circle").data(scope.data) //.filter(function(d) { return d > 0; }))
        
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

				var noneback = svg.selectAll('.noneback').data(scope.data);
				noneback.enter()
					.append('rect')
					.attr({
	          x: function(d, i) { return xScale(i) - 39; },
						y: yValue - 16,
						fill: '#fff',
						width: 78,
						height: 26,
						class: 'noneback',
						opacity: function(d) { return d > 0 ? 0 : 1; },
					})	

				var none = svg.selectAll('.none').data(scope.data);
				none.enter()	
					.append('text')
					.attr({
	          x: function(d, i) { return xScale(i); },
						y: yValue,
						class: 'none',
						'dominant-baseline': 'middle',
						'text-anchor':'middle',
						opacity: function(d) { return d > 0 ? 0 : 1; },
						'background-color': '#fff',
						'padding': '10px',
						'font-family': 'rockwellRegular',
						'font-size': '20px',
						fill: '#666'
					})
					.text('NONE')

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
          .style('filter', 'url(#glow)')

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
              this.textContent = d > 0 ? amountText(d, i(t)) : '';
            }
          })
      } 
   }
 }
})

app.directive('searchBox', function(DataRequestFactory, $state) {
  return {
    restrict: 'E',
    scope: {
    	button:'='
    },
    template:
      "<input class='input-sm' type='text' ng-model='searchValue' placeholder='Candidate Name or Zipcode' typeahead-wait-ms='200' typeahead-append-to-body='true' typeahead='result.label as result for result in search($viewValue)' typeahead-template-url='common/search-results.tpl.html' typeahead-loading='loadingSearch' typeahead-editable='false' typeahead-on-select='select($item, $model, $label)'>"+
      "<button ng-if='button' class=' btn btn-md btn-detault searchButton' type='submit' ng-click='search()'>GO</button>"+
      "<loading ng-class=\"{small: !button, 'small-button': button}\" loading='loadingSearch'/>",
    link: function(scope, element, attribs) {
      scope.searchValue = '';
      scope.loadingSearch = false;
      element.find('input').focus();
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
      	scope.searchValue = '';
        if (item.err) { 
          return; 
        } else {
          var route = item.type == 'c' ? 'candidateProfile' : 'candidateList';
          $state.go('kochTracker.candidatesView.'+route, {input:item.id,state:item.state});
        }
      }
    }
  };
});

app.directive('infoPopup', function($state) {
  return {
    restrict: "A",
    scope: { 
      content: "@",
      link: "@"
    },
    template: 
      "<span ng-click='go()' class='glyphicon glyphicon-question-sign info-popup' popover-placement='top' popover-append-to-body='true' popover-trigger='mouseenter' popover-html-unsafe='{{content}}'/>",
    link: function(scope, element, attr) {
      scope.go = function() {
        if (scope.link) {
          $state.go(scope.link);
        }
      }
    }
  }
})

app.directive("popoverHtmlUnsafePopup", function () {
  return {
    restrict: "EA",
    replace: true,
    scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
    template: 
    "<div class='popover {{placement}}' ng-class='{ in: isOpen(), fade: animation() }'>"+
    "  <div class='arrow'></div>"+
    "  <div class='popover-inner'>"+
    "      <h3 class='popover-title' ng-bind='title' ng-show='title'></h3>"+
    "      <div class='popover-content' bind-html-unsafe='content'></div>"+
    "  </div>"+
    "</div>",
    link: function(scope, element, attr) {
    }
   }
})

app.directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
  return $tooltip("popoverHtmlUnsafe", "popover", "click");
}]);

app.directive('preventDefault', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  };
});

app.directive('autoFocus', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
    	element.bind('click', function (event) {
	    	element.find('input').focus();
	    })
    }
  };
});

app.directive('shareThis', function ($location) {
  return {
    restrict: 'A',
    scope: true,
    template: "<div class='addthis_sharing_toolbox'></div>",
    link: function (scope, element, attrs) {
    	// scope.url = $location.absUrl();
    	// scope.$on('$locationChangeSuccess', function(event) {
    	// 	scope.url = $location.absUrl();
    	// });
    }
  };
});


app.directive('shareStoryButton', function(DataRequestFactory, $modal, $messages) {
  return {
    restrict: 'A',
    replace:true,
    scope: true,
    template: "<button class='btn btn-default share-story-button' ng-click='showForm()'>Share your story</button>",
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
