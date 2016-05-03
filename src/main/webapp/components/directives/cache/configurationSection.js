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
        readOnly: '=',
        outsideController: '='
      },
      replace: true,
      templateUrl: 'components/directives/cache/configuration-section.html',
      link: function (scope) {
        if (utils.isNotNullOrUndefined(scope.outsideController)){
          if (utils.isArray(scope.outsideController)){
            var handle = {};
            scope.outsideController.push(handle);
            scope.internalController = handle;
          } else {
            scope.internalController = scope.outsideController;
          }
        } else {
          scope.internalController = {};
        }

        scope.cleanFieldMetadata = function (field) {
          if (utils.isNotNullOrUndefined(scope.metadata[field])){
            scope.metadata[field].uiModified = false;
            scope.metadata[field].style = null;
          } else {
            console.log("Cleaning metadata for configuration field " + field + ", that field does not exist in DMR model")
          }
        };


        scope.cleanMetadata = function () {
          scope.fields.forEach(function (group) {
            group.fields.forEach(function (attrName) {
              scope.cleanFieldMetadata(attrName);
              if (utils.isNotNullOrUndefined(scope.data[attrName])) {
                scope.prevData[attrName] = scope.data[attrName];
              } else {
                scope.prevData[attrName] = '';
              }
            });
          });
        };

        scope.isFieldValueModified = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field].uiModified === true;
        };

        scope.undoFieldChange = function (field) {
          scope.data[field] = scope.prevData[field];
          scope.metadata[field].uiModified = false;
          scope.metadata[field].style = null;
        };

        scope.hasAnyFieldPreloadedData = function () {
          return scope.fields.some(function(group) {
            return group.fields.some(function (attrName) {
              return utils.isNotNullOrUndefined(scope.data[attrName]);
            });
          });
        };

        scope.prevData = {};
        //if not initializing to defaults then make root node in the model tree (if not existing already)
        if (!utils.isNotNullOrUndefined(scope.data)) {
          scope.data = {};
        }
        if (scope.initDefaults) {
          scope.placeholder = {};
          scope.fields.forEach(function (group) {
            group.fields.forEach(function (attrName) {
              if (scope.metadata[attrName].hasOwnProperty('default')) {
                scope.placeholder[attrName] = scope.metadata[attrName].default;
              }
            });
          });
        }

        scope.data['is-new-node'] = !scope.hasAnyFieldPreloadedData();

        //now clean any previous metadata and record field values in model so they can be reverted (undo)
        scope.cleanMetadata();

        scope.resolveFieldType = function (field) {
          return utils.resolveFieldType(scope.metadata, field);
        };

        scope.resolveDefaultValue = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) ? scope.metadata[field].default : 'unspecified';
        };

        scope.isFieldModified = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) ? scope.metadata[field].uiModified: false;
        };

        scope.isAnyFieldModified = function () {
          return scope.fields.some(function(group) {
            return group.fields.some(function (attrName) {
              return scope.isFieldModified(attrName);
            });
          });
        };

        scope.fieldChangeRequiresRestart = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field]['restart-required'] !== 'no-services';
        };

        scope.requiresRestart = function () {
          return scope.fields.some(function (group) {
            return group.fields.some(function (attrName) {
              return scope.isFieldModified(attrName) && scope.fieldChangeRequiresRestart(attrName);
            });
          });
        };

        scope.isSingleValue = function (field) {
          return !scope.isMultiValue(field);
        };

        scope.fieldValueModified = function (field) {
          if (scope.prevData[field] !== scope.data[field]) {
            scope.metadata[field].uiModified = true;
            scope.metadata[field].style = {'background-color': '#fbeabc'};
            scope.$emit('configurationFieldDirty', field);
          } else {
            scope.$emit('configurationFieldClean', field);
            scope.metadata[field].uiModified = false;
            scope.metadata[field].style = null;
          }
        };

        scope.getStyle = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) ? scope.metadata[field].style : '';
        };

        scope.isMultiValue = function (field) {
          var hasField = utils.has(scope.metadata[field], 'allowed');
          return hasField ? utils.isNotNullOrUndefined(scope.metadata[field].allowed) : false;
        };

        scope.resolveFieldName = function (field) {
          return utils.convertCacheAttributeIntoFieldName(field);
        };

        scope.isReadOnly = function (field) {
          switch (field) {
            case 'template-name':
              var mutable = scope.data['is-create-with-bare-template'];
              return utils.isNotNullOrUndefined(mutable) && !mutable;
            case 'type':
              var mutable = scope.data['is-create-mode'];
              return utils.isNotNullOrUndefined(mutable) && !mutable;
            default:
              return false;
          }
        };

        /**
         *
         * Below we expose methods we need outside of this directive
         * The methods will be available through an object handle assigned
         * to outsideController attribute of <configuration-section> HTML
         * element
         *
         */

        scope.internalController.requiresRestart = scope.requiresRestart;
        scope.internalController.cleanMetadata = scope.cleanMetadata;
        scope.internalController.isAnyFieldModified = scope.isAnyFieldModified;
      }
    };
  }
  ]);

  /***
   * TODO Hook JSON to text conversion so objects can be displayed to users
   *
   * module.directive('jsonify', ['utils', function (utils) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$formatters.push(function (object) {
          if (utils.isObject(object)) {
            return angular.toJson(object, true);
          } else {
            return object;
          }
        });
      }
    }
  }]);*/
}());
