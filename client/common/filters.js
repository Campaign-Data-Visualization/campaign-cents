'use strict';
var app = angular.module('kochTracker')

app.filter('safehtml', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

app.filter('counter', function($sce, $filter) {
    return function(val) {
        var num = $filter('number')(val, 0);
        return '<span>'+(num.split("").join('</span><span>'))+'</span>'
    };
});