(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.generalinvalidation', ['ispn.services.utils']);

  module.directive('generalinvalidation', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metadata: '=',
          initDefaults: '=',
          readOnly:'='
        },
        replace: true,
        templateUrl: 'components/directives/cache/general/generalinvalidation.html',
        link: function (scope, element, attrs) {
          scope.cacheTypes = ['distributed-cache', 'local-cache','replicated-cache', 'invalidation-cache'];

          if (scope.initDefaults){
            scope.data.type = 'invalidation-cache';
            scope.data.data = {};
            scope.data.data.mode = 'SYNC';

            ['auto-config', 'remote-timeout', 'queue-flush-interval', 'queue-size', 'batching',
              'start', 'statistics'].forEach(function (attrName) {
                scope.data.data[attrName] = scope.metadata[attrName].default;
              });
          }

          scope.$watch("form.cacheName.$valid", function (){
            scope.$emit("createEnabled", scope.form.cacheName.$valid);
          });
        }
      };
    }
  ]);
}());
