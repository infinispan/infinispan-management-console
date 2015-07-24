(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.general', ['ispn.services.utils']);

  module.directive('general', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          initDefaults: '=',
          readOnly:'='
        },
        replace: true,
        templateUrl: 'components/directives/cache/general/general.html',
        link: function (scope, element, attrs) {
          scope.cacheTypes = ['distributed-cache', 'local-cache','replicated-cache', 'invalidation-cache'];
          scope.cacheModes = [ 'SYNC', 'ASYNC'];

          if (scope.initDefaults){
            scope.data.type = 'distributed-cache';
            scope.data.data = {};
            scope.data.data.mode = 'SYNC';
          }

          scope.$watch("data.type", function (){
            scope.$emit("createCacheTypeSelected", scope.data.type);
          });

          scope.isLocalCache = function () {
            return scope.data.type === 'local-cache';
          }
        }
      };
    }
  ]);
}());
