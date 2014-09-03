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
