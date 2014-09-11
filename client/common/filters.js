'use strict';
var app = angular.module('kochTracker')

app.filter('safehtml', function($sce) {
    return function(val) {
      console.log(val)
        return $sce.trustAsHtml(val);
    };
});