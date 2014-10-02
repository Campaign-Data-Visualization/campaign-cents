'use strict';
var app = angular.module('kochTracker')

app.service('$messages', ['$rootScope', function($rootScope) {
	var service = this;
	service.messages = [];
	service.modal = false;

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
		service.modal = false;
	}
	
	$rootScope.$on("$stateChangeStart", function(event, next, current) {
		service.clearMessages();
	});
}]);
