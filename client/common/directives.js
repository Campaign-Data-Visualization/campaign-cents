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
