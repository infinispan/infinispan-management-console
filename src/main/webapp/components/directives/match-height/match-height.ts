'use strict';
angular.module('ispn.directives.matchheight', [])
  .directive('matchHeight', [
    function () {
      return {
        restrict: 'A',
        scope: {},
        link: function (scope, elm, attrs) {
          var result = document.getElementsByClassName(attrs.matchHeight);
          var wrappedResult = angular.element(result);
          wrappedResult.matchHeight({byRow: false});
        }
      };
    }]);
