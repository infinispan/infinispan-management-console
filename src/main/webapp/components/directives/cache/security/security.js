(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.security', ['ispn.services.utils']);

  module.directive('security', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metadata: '=',
          initDefaults: '=',
          readOnly:'='
        },
        replace: true,
        templateUrl: 'components/directives/cache/security/security.html',
        link: function (scope, element, attrs) {

          if (scope.initDefaults){
            scope.data = {};
            scope.data.authorization = {};
            scope.data.authorization.enabled = scope.metadata.enabled.default;
          }
        }
      };
    }
  ]);
}());
