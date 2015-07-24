(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.configurationsection', ['ispn.services.utils']);

  module.directive('configurationSection', ['utils', function (utils) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        metadata: '=',
        fields: '=',
        initDefaults: '=',
        readOnly: '='
      },
      replace: true,
      templateUrl: 'components/directives/cache/configuration-section.html',
      link: function (scope, element, attrs) {
        if (scope.initDefaults) {
          scope.data = {};
          scope.fields.forEach(function (attrName) {
            if (scope.metadata[attrName].hasOwnProperty('default')) {
              scope.data[attrName] = scope.metadata[attrName].default;
            }
          });
        }

        scope.resolveFieldType = function (field) {
          return utils.resolveFieldType(scope.metadata, field);
        };

        scope.isSingleValue = function (field) {
          return !scope.isMultiValue(field);
        };

        scope.isMultiValue = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field].allowed);
        };

        scope.resolveFieldName = function (field) {
          return utils.convertCacheAttributeIntoFieldName(field);
        };
      }
    };
  }
  ]);
}());
