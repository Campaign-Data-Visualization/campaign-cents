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
