'use strict';
var app = angular.module('myApp')

app.service('$messages', function($rootScope) {
	var service = this;
	service.messages = [];

	service.addMessage = function(message, type) {
		var type = type || 'info';
		service.messages.push({message: message, type: type});
	};

	service.error = function(message) { 
		console.log('Error: '+message);
   		service.addMessage("We're sorry, an error occurred: "+message, 'danger');
	}
	
	service.getMessages = function() { 
		return service.messages;
	};

	service.deleteMessage = function(index) { 
		service.messages.splice(index, 1);
	}

	service.clearMessages = function() { 
		service.messages = [];
	}
	
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		service.clearMessages();
	});
});
