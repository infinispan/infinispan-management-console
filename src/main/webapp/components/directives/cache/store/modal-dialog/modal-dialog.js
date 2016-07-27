(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.modaldialog', ['ispn.services.utils']);

  module.directive('modalDialog', ['utils', '$modal', function (utils, modal) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        field: '@',
        fieldMeta: '=',
        modalFields: '=',
        outsideController: '=',
        previousValues: '=',
        parentMeta: '=',
        title: '@'
      },
      replace: true,
      templateUrl: 'components/directives/cache/store/modal-dialog/views/modal-button.html',
      link: function (scope) {

        scope.getStyle = function () {
          return utils.isNullOrUndefined(scope.parentMeta) ? '' : scope.parentMeta.style;
        };

        scope.resolveDataField = function (data, field) {
          if (utils.isNotNullOrUndefined(data)) {
            var object = field.indexOf('.') > -1 ? utils.deepGet(data, field) : data[field];

            if (utils.isNotNullOrUndefined(object)) {
              return object;
            }
          }
          var newData = {};
          newData[field] = {};
          return newData;
        };

        scope.openModal = function () {
          var modalInstance = modal.open({
            templateUrl: 'components/directives/cache/store/modal-dialog/views/modal-template.html',
            resolve: {
              store: function () {
                return {
                  data: scope.resolveDataField(scope.data, scope.field),
                  metadata : scope.fieldMeta,
                  prevData: utils.isNullOrUndefined(scope.previousValues) ? {} : scope.previousValues,
                  title: scope.title,
                  fields: scope.modalFields
                };
              }
            },
            controller: ['$scope', 'utils', '$modalInstance', 'store', function ($scope, utils, $modalInstance, store) {
              $scope.title = store.title;
              $scope.metadata = store.metadata;
              $scope.data = store.data;
              $scope.prevData = store.prevData;
              $scope.fields = store.fields;

              $scope.cancelModal = function () {
                $scope.undoAllFieldChanges($scope.data);
                $modalInstance.dismiss('cancel');
              };

              $scope.submitModal = function () {
                $scope.data.modified = $scope.isObjectModified($scope.data, $scope.metadata);
                $modalInstance.close($scope.data);
              };

              $scope.isObjectModified = function (data, metadata) {
                for (var key in data) {
                  if (data.hasOwnProperty(key) && utils.isNotNullOrUndefined(metadata[key])) {
                    var value = data[key];
                    var modified = false;
                    if (utils.isObject(value)) {
                      var subMeta = metadata[key]['value-type'];
                      modified = $scope.isObjectModified(value, subMeta);
                    } else {
                      modified = metadata[key].uiModified;
                    }
                    if (modified) {
                      return true;
                    }
                  }
                }
                return false;
              };

              $scope.getMetadataObject = function (field, parent) {
                if (utils.isNotNullOrUndefined(parent)) {
                  return $scope.metadata[parent]['value-type'][field];
                } else {
                  return $scope.metadata[field];
                }
              };

              $scope.undoFieldChange = function (field, parent) {
                var meta = $scope.getMetadataObject(field, parent);
                utils.makeFieldClean(meta);

                if (utils.isNotNullOrUndefined(parent)) {
                  $scope.data[parent][field] = angular.copy($scope.prevData[parent][field]);
                } else {
                  $scope.data[field] = angular.copy($scope.prevData[field]);
                }
              };

              $scope.undoAllFieldChanges = function (object, parent) {
                for (var key in object) {
                  if (key === 'is-new-node') {
                    continue;
                  }
                  var val = object[key];
                  if (utils.isObject(val)) {
                    $scope.undoAllFieldChanges(val, key);
                  } else {
                    $scope.undoFieldChange(key, parent);
                  }
                }
              };

              $scope.isParentDefined = function (field) {
                return utils.isNotNullOrUndefined(field.parent);
              };

              $scope.resolveFieldName = function (field, parent) {
                var fieldName = utils.convertCacheAttributeIntoFieldName(field);
                if (utils.isNotNullOrUndefined(parent)) {
                  fieldName = utils.convertCacheAttributeIntoFieldName(parent) + ' ' + fieldName
                }
                return fieldName;
              };
            }]
          });

          var modalSuccessCallback = function (storeObject) {
            // We still need to do this if !modified, as a user may have entered something and then deleted it,
            // thus setting the field to an empty string which will result in a WFLY error from the DMR.
            utils.removeEmptyFieldsFromObject(storeObject, true);
            if (!utils.isEmptyObject(storeObject) && storeObject.modified) {
              delete storeObject.modified;

              scope.data[scope.field] = storeObject;
              utils.makeFieldDirty(scope.parentMeta, scope.field, true, scope);

              if (utils.isNotNullOrUndefined(scope.outsideController)) {
                scope.outsideController.requiresRestart = function () {
                  return true;
                }
              }
            }
          };

          var modalCancelledCallback = function() {
            utils.makeFieldClean(scope.parentMeta);
          };

          modalInstance.result.then(modalSuccessCallback, modalCancelledCallback);
        };
      }
    };
  }]);
}());
