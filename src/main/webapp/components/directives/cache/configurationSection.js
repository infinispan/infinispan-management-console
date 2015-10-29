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
        scope.cleanFieldMetadata = function (field) {
          scope.metadata[field].uiModified = false;
          scope.metadata[field].style = null;
        };

        scope.isFieldValueModified = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field].uiModified) && scope.metadata[field].uiModified === true;
        };

        scope.undoFieldChange = function (field) {
          scope.data[field] = scope.prevData[field];
          scope.metadata[field].uiModified = false;
          scope.metadata[field].style = null;
        };

        scope.prevData = {};
        if (scope.initDefaults) {
          scope.data = {};
          scope.fields.forEach(function (attrName) {
            if (scope.metadata[attrName].hasOwnProperty('default')) {
              scope.data[attrName] = scope.metadata[attrName].default;
            }
          });
        } else {
          //if not initializing to defaults then make root node in the model tree (if not existing already)
          if (!utils.isNotNullOrUndefined(scope.data)){
            scope.data = {};
          }
        }

        //now clean any previous metadata and record field values in model so they can be reverted (undo)
        scope.fields.forEach(function (attrName) {
          if(utils.isNotNullOrUndefined(scope.data[attrName])){
            scope.prevData[attrName] = scope.data[attrName];
          } else {
            scope.prevData[attrName] = '';
          }
        });

        scope.resolveFieldType = function (field) {
          return utils.resolveFieldType(scope.metadata, field);
        };

        scope.fieldChangeRequiresRestart = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field]['restart-required'] === 'resource-services';
        };

        scope.isSingleValue = function (field) {
          return !scope.isMultiValue(field);
        };

        scope.fieldValueModified = function (field) {
          if (scope.prevData[field] != scope.data[field]) {
            scope.metadata[field].uiModified = true;
            scope.metadata[field].style = {'background-color': '#fbeabc'};
          } else {
            scope.metadata[field].uiModified = false;
            scope.metadata[field].style = null;
          }
        };

        scope.getStyle = function (field) {
          return scope.metadata[field].style;
        };

        scope.isMultiValue = function (field) {
          var hasField = utils.has(scope.metadata[field], 'allowed');
          return hasField ? utils.isNotNullOrUndefined(scope.metadata[field].allowed) : false;
        };

        scope.resolveFieldName = function (field) {
          return utils.convertCacheAttributeIntoFieldName(field);
        };
      }
    };
  }
  ]);
}());
