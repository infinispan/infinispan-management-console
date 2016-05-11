(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.jdbcstore', ['ispn.services.utils']);

  module.directive('jdbcstore', ['utils', '$modal', function (utils, modal) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metadata: '=',
          initDefaults: '=',
          readOnly:'=',
          outsideController: '='
        },
        replace: true,
        templateUrl: 'components/directives/cache/jdbcstore/jdbcstore.html',
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

          scope.getStoreType = function () {
            var array = scope.metadata.storeTypes;
            for (var i = 0; i < array.length; i++) {
              var store = scope.data[array[i]];
              if (utils.isNotNullOrUndefined(store)) {
                return array[i];
              }
            }
            return '';
          };

          scope.getStoreObject = function () {
            var storeKey = scope.data['jdbc-type'];
            if (utils.isNullOrUndefined(scope.data[storeKey])) {
              return {};
            }

            var objectKey = scope.getStoreObjectKey(storeKey);
            if (utils.isNullOrUndefined(scope.data[storeKey][objectKey])) {
              scope.data[storeKey][objectKey] = {};
            }
            return scope.data[storeKey][objectKey];
          };

          scope.getStoreObjectKey = function (storeKey) {
            return storeKey.toUpperCase().replace(/-/g, '_');
          };

          scope.hasStringKeyedTable = function () {
            return utils.isNotNullOrUndefined(scope.data) && utils.isNotNullOrUndefined(scope.data['string-keyed-table']);
          };

          scope.hasBinaryKeyedTable = function () {
            return utils.isNotNullOrUndefined(scope.data) && utils.isNotNullOrUndefined(scope.data['binary-keyed-table']);
          };

          scope.getCheckBoxes = function () {
            var boxes = [];
            angular.forEach(scope.metadata, function (value, key) {
              var type = value['type'];
              if (utils.isNotNullOrUndefined(type)) {
                var modelType = type['TYPE_MODEL_VALUE'];
                if (utils.isNotNullOrUndefined(modelType) && modelType === 'BOOLEAN') {
                  boxes.push(key);
                }
              }
            });
            return boxes;
          };

          scope.updateStoreType = function (previousType) {
            var type = scope.data['jdbc-type'];
            var previousStore = scope.store;
            if (utils.isNonEmptyString(previousType)) {
              if (utils.isNotNullOrUndefined(previousStore)) {
                switch (type) {
                  case 'string-keyed-jdbc-store':
                    delete previousStore['binary-keyed-table'];
                    break;
                  case 'binary-keyed-jdbc-store':
                    delete previousStore['string-keyed-table'];
                }
              }
              scope.data[previousType] = null;
            }

            var objectKey = scope.getStoreObjectKey(type);
            scope.data[type] = {};
            scope.data[type][objectKey] = previousStore;
            scope.store = scope.data[type][objectKey];
            var newNode =  scope.prevData['jdbc-type'] !== scope.data['jdbc-type'];
            scope.store['is-new-node'] = newNode;

            if (newNode) {
              scope.metadata['jdbc-type'].uiModified = true;
              scope.metadata['jdbc-type'].style = {'background-color': '#fbeabc'};
              scope.$emit('configurationFieldDirty', 'jdbc-type');
            }
          };

          scope.cleanMetadata = function () {
            angular.forEach(scope.metadata, function (value, key) {
              if (utils.isObject(value)) {
                value.uiModified = false;
                value.style = null;
                scope.prevData[key] = angular.copy(scope.store[key]);
              }
            });

            scope.prevData['jdbc-type'] = scope.data['jdbc-type'];
            scope.metadata['jdbc-type'] = {
              uiModified: false,
              style: null
            };
            scope.store['jdbc-original-type'] = scope.prevData['jdbc-type'];
          };

          scope.fieldValueModified = function (field) {
            if (scope.prevData[field] !== scope.store[field]) {
              scope.metadata[field].uiModified = true;
              scope.metadata[field].style = {'background-color': '#fbeabc'};
              scope.$emit('configurationFieldDirty', field);
            } else {
              scope.$emit('configurationFieldClean', field);
              scope.metadata[field].uiModified = false;
              scope.metadata[field].style = null;
            }
          };

          scope.isFieldValueModified = function (field) {
            return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field].uiModified === true;
          };

          scope.fieldChangeRequiresRestart = function (field) {
            if (field === 'string-keyed-table' || field === 'binary-keyed-table') {
              return true;
            }
            return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field]['restart-required'] !== 'no-services';
          };

          scope.requiresRestart = function () {
            return Object.keys(scope.metadata).some(function(field){
                return scope.isFieldValueModified(field) && scope.fieldChangeRequiresRestart(field);
            });
          };

          scope.undoFieldChange = function (field) {
            scope.store[field] = scope.prevData[field];
            scope.metadata[field].uiModified = false;
            scope.metadata[field].style = null;
          };

          scope.undoTypeChange = function () {
            scope.data['jdbc-type'] = scope.prevData['jdbc-type'];
            scope.metadata['jdbc-type'].uiModified = false;
            scope.metadata['jdbc-type'].style = null;
          };

          scope.getStyle = function (field) {
            return utils.isNotNullOrUndefined(scope.metadata[field]) ? scope.metadata[field].style : '';
          };

          scope.resolveFieldName = function (field) {
            return utils.convertCacheAttributeIntoFieldName(field);
          };

          if (!utils.isNotNullOrUndefined(scope.data)){
            scope.data = {};
          }
          scope.metadata.storeTypes = ['string-keyed-jdbc-store','mixed-keyed-jdbc-store', 'binary-keyed-jdbc-store'];
          scope.metadata.checkboxes = scope.getCheckBoxes();
          scope.data['jdbc-type'] = scope.getStoreType();
          scope.store = scope.getStoreObject();
          scope.store['is-new-node'] = scope.getStoreType() === '';
          scope.prevData = {};
          scope.cleanMetadata();

          if (scope.initDefaults) {
            scope.data['jdbc-type'] = null;

            ['fetch-state', 'passivation', 'preload', 'purge', 'read-only',
              'shared', 'singleton'].forEach(function (attrName) {
              scope.store[attrName] = scope.metadata[attrName].default;
            });
          }

          scope.internalController.requiresRestart = scope.requiresRestart;
          scope.internalController.cleanMetadata = scope.cleanMetadata;

          scope.openModal = function (keyType) {
            scope.metadata['key-type'] = keyType;
            var modalInstance = modal.open({
              templateUrl: 'components/directives/cache/jdbcstore/keyed-table-modal.html',
              controller: KeyedTableModalInstanceCtrl,
              scope: scope,
              resolve: function () {
                return $scope.data;
              }
            });

            modalInstance.result.then(function (newKeyedTable) {
              scope.store[keyType] = newKeyedTable;
              scope.fieldValueModified(keyType);
            });
          };

          var KeyedTableModalInstanceCtrl = function ($scope, utils, $modalInstance) {
            $scope.keyType = $scope.$parent.metadata['key-type'];
            $scope.data = $scope.$parent.store[$scope.keyType];
            $scope.title = $scope.$parent.resolveFieldName($scope.keyType);
            $scope.metadata = $scope.$parent.metadata[$scope.keyType]['value-type'];

            if (utils.isNullOrUndefined($scope.$parent.prevData[$scope.keyType])) {
              $scope.$parent.prevData[$scope.keyType] = {};
            }
            $scope.prevData = $scope.$parent.prevData[$scope.keyType];

            $scope.cancelModal = function () {
              delete $scope.metadata['key-type'];
              $modalInstance.dismiss('cancel');
            };

            $scope.submitModal = function () {
              delete $scope.metadata['key-type'];
              $modalInstance.close($scope.data);
            };

            $scope.resolveFieldDescription = function (field, parent) {
              if (utils.isNotNullOrUndefined(parent)) {
                return $scope.metadata[parent]['value-type'][field].description;
              } else {
                return $scope.metadata[field].description;
              }
            };

            $scope.getStyle = function (field, parent) {
              var meta = $scope.getMetadataObject(field, parent);
              return utils.isNotNullOrUndefined(meta) ? meta.style : '';
            };

            $scope.getObject = function (object, field, parent) {
              if (utils.isNullOrUndefined(object)) {
                return null
              }

              if (utils.isNotNullOrUndefined(parent)) {
                if (utils.isNullOrUndefined(object[parent])) {
                  object[parent] = {
                    field: null
                  };
                }
                return object[parent][field];
              } else {
                return object[field];
              }
            };

            $scope.getMetadataObject = function (field, parent) {
              if (utils.isNotNullOrUndefined(parent)) {
                return $scope.metadata[parent]['value-type'][field];
              } else {
                return $scope.metadata[field];
              }
            };

            $scope.fieldValueModified = function (field, parent) {
              var currentVal = $scope.getObject($scope.data, field, parent);
              var previousVal = $scope.getObject($scope.prevData, field, parent);
              var meta = $scope.getMetadataObject(field, parent);

              if (currentVal !== previousVal) {
                meta.uiModified = true;
                meta.style = {'background-color': '#fbeabc'};
              } else {
                meta.uiModified = false;
                meta.style = null;
              }
            };

            $scope.undoFieldChange = function (field, parent) {
              var meta = $scope.getMetadataObject(field, parent);
              meta.uiModified = false;
              meta.style = null;

              if (utils.isNotNullOrUndefined(parent)) {
                $scope.data[parent][field] = $scope.prevData[parent][field];
              } else {
                $scope.data[field] = $scope.prevData[field];
              }
            };

            $scope.isFieldValueModified = function (field, parent) {
              return $scope.getMetadataObject(field, parent).uiModified === true;
            };

            $scope.fieldChangeRequiresRestart = function (field, parent) {
              return $scope.getMetadataObject(field, parent)['restart-required'] !== 'no-services';
            };
          };
        }
      };
    }
  ]);
}());
