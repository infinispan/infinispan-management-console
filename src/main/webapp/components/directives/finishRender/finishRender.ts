'use strict';
angular.module('ispn.directives.finishrender', [])
  .directive('onFinishRender', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        //Calling a scoped method
        //http://stackoverflow.com/questions/11953348/angularjs-callback-after-render-work-with-dom-after-render/
        $timeout(scope.matchHeight, 0);
      }
    };
  }]);

