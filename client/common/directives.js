'use strict';
var app = angular.module('myApp')

app.directive('messages', function($messages) {
  return {
    restrict: 'A',
    scope: true,
    template: "<alert class='message' type='{{message.type}}' close='close($index)' ng-repeat='message in messageService.messages'><div>{{message.message}}</div>",
    link: function(scope, element, attribs) { 
      scope.messageService = $messages;
      scope.close = $messages.deleteMessage;
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

app.directive('bubbleChart', function($window) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    template: "<div class='bubble-chart'><svg width='640' height='190'><filter id='glow' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='2 2' result='glow'/><feMerge><feMergeNode in='glow'/><feMergeNode in='glow'/><feMergeNode in='glow'/></feMerge></filter> </svg></div>",
    link: function(scope, elem, attrs){
      
      var maxRadius = 65;
      var yValue = maxRadius + 30 + 25;
      
      var defaults =  [
        {label: "Tier One", color: '#69AC2A'},
        {label: 'Tier Two', color: '#2E8C64'},
        {label: 'Prior Years', color: '#0073B9'},
        {label: 'Lifetime Total', color: '#00516E'}
      ];

      var pathClass="path";
      var xScale, yScale, xAxisGen, yAxisGen, zScale, amountText, commas;

      var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);

      function setChartParameters(){
        xScale = d3.scale.linear()
          .domain([0, 3])
          .range([maxRadius, rawSvg.attr("width") - maxRadius]);
       
        zScale = d3.scale.linear()
	        .domain([1, d3.max(scope.data, function(d) { return d; })])
	        .range([20, 65]);

        xAxisGen = d3.svg.axis()
	        .scale(xScale)
	        .orient("top")
	        .ticks(scope.data.length)
	        .tickValues([0, 1, 2,3])
	        .tickFormat(function(d, i) { return defaults[i].label; })
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
        //var labels = svg.selectAll("")
        circle.enter().append("svg:circle")
          .attr({
            r: 0,
            cx: function(d, i) { return xScale(i); },
            cy: yValue,
            "stroke": "white",
            "stroke-width": 2,
            "fill": function(d, i) { return defaults[i].color },
            //"class": pathClass
          });

        circle.transition()
        	.ease('elastic')
        	//.delay(2000)
          .duration(1500)
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
          //.style('fill','#333')

        amounts.enter().append('text')
        	.attr('x',function(d, i) { return xScale(i); })
          .attr('class','chart-label amount')
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor','middle')
          .attr('y', yValue)
          //.style('fill','#fff');

        amounts_group.selectAll('text').transition()
          .duration(1000)
          .attr('width',function(d) { return zScale(d) * 2; })
          .tween('text', function(d) { 
            var i = d3.interpolate(this.textContent.replace(/[^0-9]+/g, ''), d);
            return function(t) { 
              this.textContent = amountText(d, i(t));
            }
          })
      } 
      drawBubbleChart();

   }
 }
})

app.directive('searchBox', function(DataRequestFactory, $state) {
  return {
    restrict: 'E',
    scope: true,
    template: "<div class='search-box-container'>"+
      "<input type='text' ng-model='searchValue' placeholder='Zipcode or Candidate Name' typeahead='result.label as result for result in search($viewValue)' typeahead-template-url='common/search-results.tpl.html' typeahead-loading='loadingSearch' typeahead-editable='false' class='form-control search-box' typeahead-on-select='select($item, $model, $label)'>"+
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
          $state.go('myApp.main.candidatesView.'+route, {input:item.id,state:item.state});
        }
      }
    }
  };
});
