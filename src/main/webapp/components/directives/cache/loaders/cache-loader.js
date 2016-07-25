(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.cacheLoader', ['ispn.services.utils']);

  module.directive('cacheLoader', ['utils', function (utils) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        metadata: '=',
        readOnly: '=',
        outsideController: '='
      },
      replace: true,
      templateUrl: 'components/directives/cache/loaders/cache-loader.html',
      link: function (scope) {

        scope.init = function () {
          scope.fields = ['preload', 'shared'];
          scope.allFields = scope.fields.concat(scope.fields, 'class');
          scope.cacheLoaders = [
            {
              class: 'None',
              label: 'No Cache Loader'
            },
            {
              class: 'org.infinispan.persistence.async.AsyncCacheLoader',
              label: 'Async Cache Loader'
            },
            {
              class: 'org.infinispan.persistence.async.AdvancedAsyncCacheLoader',
              label: 'Advanced Async Cache Loader'
            },
            {
              class: 'org.infinispan.persistence.jdbc.binary.JdbcBinaryStore',
              label: 'Binary Based JDBC Store'
            },
            {
              class: 'org.infinispan.persistence.cluster.ClusterLoader',
              label: 'Cluster Loader'
            },
            {
              class: '',
              label: 'Custom Loader'
            },
            {
              class: 'org.infinispan.persistence.jpa.JpaStore',
              label: 'JPA Store'
            },
            {
              class: 'org.infinispan.persistence.leveldb.LevelDBStore',
              label: 'LevelDB Store'
            },
            {
              class: 'org.infinispan.persistence.jdbc.mixed.JdbcMixedStore',
              label: 'Mixed JDBC Store'
            },
            {
              class: 'org.infinispan.persistence.remote.RemoteStore',
              label: 'Remote Store'
            },
            {
              class: 'org.infinispan.persistence.rest.RestStore',
              label: 'Rest Store'
            },
            {
              class: 'org.infinispan.persistence.file.SingleFileStore',
              label: 'Single File Store'
            },
            {
              class: 'org.infinispan.persistence.sifs.SoftIndexFileStore',
              label: 'Soft Index File Store'
            },
            {
              class: 'org.infinispan.persistence.jdbc.stringbased.JdbcStringBasedStore',
              label: 'String Based JDBC Store'
            }
          ];
          scope.initInternalController();
          scope.initPrevDataAndDefaults();
          scope.cleanMetadata();
        };

        scope.initInternalController = function () {
          if (utils.isNotNullOrUndefined(scope.outsideController)) {
            if (utils.isArray(scope.outsideController)) {
              var handle = {};
              scope.outsideController.push(handle);
              scope.internalController = handle;
            } else {
              scope.internalController = scope.outsideController;
            }
          } else {
            scope.internalController = {};
          }

          scope.internalController.requiresRestart = scope.requiresRestart;
          scope.internalController.cleanMetadata = scope.cleanMetadata;
          scope.internalController.isAnyFieldModified = scope.isAnyFieldModified;
        };

        scope.initPrevDataAndDefaults = function () {
          scope.prevData = {};
          //if not initializing to defaults then make root node in the model tree (if not existing already)
          if (!utils.isNotNullOrUndefined(scope.data)) {
            scope.data = {};
          }

          scope.data['is-new-node'] = utils.isNullOrUndefined(scope.data['class']);
          scope.type = scope.getStoreType(scope.data.class, scope.cacheLoaders);
        };

        scope.cleanFieldMetadata = function (field) {
          if (utils.isNotNullOrUndefined(scope.metadata[field])) {
            scope.metadata[field].uiModified = false;
            scope.metadata[field].style = null;
          } else {
            console.log("Cleaning metadata for configuration field " + field + ", that field does not exist in DMR model")
          }
        };

        scope.cleanMetadata = function () {
          scope.allFields.forEach(function (attrName) {
            scope.cleanFieldMetadata(attrName);
            if (utils.isNotNullOrUndefined(scope.data[attrName])) {
              scope.prevData[attrName] = angular.copy(scope.data[attrName]);
            } else {
              scope.prevData[attrName] = '';
            }
          });
          scope.prevData['type'] = scope.type;
          scope.cleanFieldMetadata('class');
        };

        scope.isFieldValueModified = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field].uiModified === true;
        };

        scope.undoFieldChange = function (field) {
          scope.data[field] = scope.prevData[field];
          scope.metadata[field].uiModified = false;
          scope.metadata[field].style = null;
        };

        scope.resolveDefaultValue = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) ? scope.metadata[field].default : 'unspecified';
        };

        scope.resolveFieldName = function (field) {
          return utils.convertCacheAttributeIntoFieldName(field);
        };

        scope.resolveFieldType = function (field) {
          return utils.resolveFieldType(scope.metadata, field);
        };

        scope.isFieldModified = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) ? scope.metadata[field].uiModified : false;
        };

        scope.isAnyFieldModified = function () {
          return scope.allFields.some(function (attrName) {
            return scope.isFieldModified(attrName);
          });
        };

        scope.fieldChangeRequiresRestart = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field]['restart-required'] !== 'no-services';
        };

        scope.requiresRestart = function () {
          return scope.allFields.some(function (attrName) {
            return scope.isFieldModified(attrName) && (scope.fieldChangeRequiresRestart(attrName));
          });
        };

        scope.fieldValueModified = function (field) {
          var original = scope.prevData[field];
          var latest = scope.data[field];

          if (((utils.isNullOrUndefined(original) || original === '') && !latest) || original === latest) {
            scope.$emit('configurationFieldClean', field);
            scope.metadata[field].uiModified = false;
            scope.metadata[field].style = null;
          } else {
            scope.metadata[field].uiModified = true;
            scope.metadata[field].style = {'background-color': '#fbeabc'};
            scope.$emit('configurationFieldDirty', field);
          }
        };

        scope.changeLoaderClass = function () {
          scope.data['class'] = utils.isNullOrUndefined(scope.type) ? null : angular.copy(scope.type);
          scope.fieldValueModified('class');
        };

        scope.undoClassChange = function () {
          scope.undoFieldChange('class');
          scope.type = scope.getStoreType(scope.data['class'], scope.cacheLoaders);
        };

        scope.getStyle = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) ? scope.metadata[field].style : '';
        };

        scope.getStoreType = function (classValue, cacheLoaders) {
          if (utils.isNullOrUndefined(classValue)) {
            return 'None';
          } else {
            var nonCustomStore = cacheLoaders.some(function (loader) {
              return loader.class === classValue;
            });
            return nonCustomStore ? classValue : '';
          }
        };

        scope.isCustomLoader = function () {
          if (utils.isNotNullOrUndefined(scope.type) && scope.type.length == 0) {
            return true;
          } else {
            return !scope.cacheLoaders.some(function (loader) {
              return loader.class !== scope.data.class;
            });
          }
        };

        scope.init();
      }
    };
  }
  ]);
}());
