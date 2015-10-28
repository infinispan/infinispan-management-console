(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.cacheconfiguration', ['ispn.services.utils']);

  module.directive('cacheConfiguration', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metadata: '=',
          initDefaults: '=',
          readOnly: '=',
          cacheType: '@'
        },
        replace: false,
        templateUrl: function(elem, attrs) {
          return 'components/directives/cache/'.concat(attrs.cacheType).concat('.html');
        },
        link: function (scope, element, attrs) {

          if (!scope.readOnly) {
            scope.readOnly = false;
          }
          if (!scope.initDefaults){
            scope.initDefaults = false;
          }

          scope.resourceDescriptionMap = {};
          utils.makeResourceDescriptionMap(scope.resourceDescriptionMap);


          scope.resolveDescription = function (elementPath) {
            return utils.resolveDescription(scope.metadata, scope.resourceDescriptionMap, elementPath, scope.cacheType);
          };
        }
      };
    }
  ]).directive("positiveInteger", function() {
    return {
      restrict: "A",

      require: "ngModel",

      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.positiveInteger = function(str) {
          var n = ~~Number(str);
          return String(n) === str && n >= 0;
        }
      }
    };
  });
}());
