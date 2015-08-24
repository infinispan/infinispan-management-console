(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.general', ['ispn.services.utils']);

  module.directive('general', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          initDefaults: '=',
          confs: '=',
          readOnly:'='
        },
        replace: true,
        templateUrl: 'components/directives/cache/general/general.html',
        link: function (scope, element, attrs) {
          scope.cacheTypes = ['distributed-cache', 'local-cache','replicated-cache', 'invalidation-cache'];
          scope.cacheModes = [ 'SYNC', 'ASYNC'];
          if(utils.isNonEmptyArray(scope.confs)){
            scope.data.template = scope.confs[0];
          }

          if (scope.initDefaults){
            scope.data.type = scope.cacheTypes[0];
            scope.data.data = {};
            scope.data.data.mode = 'SYNC';
          }

          scope.$watch("data.type", function (){
            scope.$emit("createCacheTypeSelected", scope.data.type);
          });

          scope.$watch("data.template", function (){
            scope.$emit("createCacheTemplateSelected", scope.data.template);
          });

          scope.isLocalCache = function () {
            return scope.data.type === 'local-cache';
          }
        }
      };
    }
  ]);
}());
