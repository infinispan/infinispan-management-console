'use strict';
angular.module('ispn.directives.finishrender', [])
  .directive('onFinishRender', ['utils', function (utils) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        var functionToCall = attr.onFinishRender;
        if (scope.$last) {
          if (utils.isNotNullOrUndefined(functionToCall)) {
            scope.$evalAsync(functionToCall);
          }
        }
      }
    };
  }]);

