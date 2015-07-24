(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.generallocal', ['ispn.services.utils']);

  module.directive('generallocal', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metadata: '=',
          initDefaults: '=',
          readOnly:'='
        },
        replace: true,
        templateUrl: 'components/directives/cache/general/generallocal.html',
        link: function (scope, element, attrs) {
          scope.cacheTypes = ['distributed-cache', 'local-cache','replicated-cache', 'invalidation-cache'];

          if (scope.initDefaults){
            scope.data.type = 'local-cache';
            scope.data.data = {};

            ['auto-config', 'batching', 'start', 'statistics'].forEach(function (attrName) {
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
