(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.generaldist', ['ispn.services.utils']);

  module.directive('generaldist', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metadata: '=',
          initDefaults: '=',
          readOnly:'='
        },
        replace: true,
        templateUrl: 'components/directives/cache/general/generaldist.html',
        link: function (scope, element, attrs) {
          scope.cacheTypes = ['distributed-cache', 'local-cache','replicated-cache', 'invalidation-cache'];
          scope.data.template = scope.data.configurationTemplate;
          if (scope.initDefaults) {
            scope.data.type = 'distributed-cache';
            scope.data.data = {};
            scope.data.data.mode = 'SYNC';

            ['auto-config', 'remote-timeout', 'capacity-factor', 'l1-lifespan',
              'queue-flush-interval', 'queue-size', 'batching', 'segments', 'owners', 'start', 'statistics'].forEach(function (attrName) {
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
