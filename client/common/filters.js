'use strict';
var app = angular.module('kochTracker');

app.filter('safehtml', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);

app.filter('counter', ['$filter', function($filter) {
    return function(val) {
    var result = '';
        var num = $filter('number')(val, 0);
        num.split("").forEach(function(n) {
          result += (n == ',' ? "<span class='comma'>" : "<span>")+n+"</span>";
        });
        return result;
    };
}]);

app.filter('characters', function () {
    return function (input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            }else{
                while(input.charAt(input.length-1) === ' '){
                    input = input.substr(0, input.length -1);
                }
            }
            return input + '...';
        }
        return input;
    };
});

app.filter('words', function () {
    return function (input, words) {
        if (isNaN(words)) return input;
        if (words <= 0) return '';
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '...';
            }
        }
        return input;
    };
});
