(function () {
    'use strict';
    var module = angular.module('ispn.directives.cache.cachestore', ['ispn.services.utils']);
    module.directive('cachestore', ['utils', function (utils) {
            var customStoreFields = ['is-new-node', 'store-original-type'];
            // These are the default fields which are loaded for each store in the order of the array
            var storeFields = {
                'None': {
                    id: 'None',
                    label: 'No Cache Store',
                    fields: []
                },
                'binary-keyed-jdbc-store': {
                    id: 'binary-keyed-jdbc-store',
                    label: 'Binary Keyed JDBC Store',
                    fields: ['datasource', 'dialect']
                },
                'store': {
                    id: 'store',
                    label: 'Custom Store',
                    fields: ['class']
                },
                'file-store': {
                    id: 'file-store',
                    label: 'File Store',
                    fields: ['max-entries', 'path', 'relative-to']
                },
                'leveldb-store': {
                    id: 'leveldb-store',
                    label: 'LevelDB Store',
                    fields: ['path', 'block-size', 'cache-size', 'clear-threshold']
                },
                'mixed-keyed-jdbc-store': {
                    id: 'mixed-keyed-jdbc-store',
                    label: 'Mixed Keyed JDBC Store',
                    fields: ['datasource', 'dialect']
                },
                'remote-store': {
                    id: 'remote-store',
                    label: 'Remote Store',
                    fields: ['remote-servers', 'cache', 'hotrod-wrapping', 'socket-timeout', 'protocol-version', 'raw-values', 'tcp-no-delay']
                },
                'rest-store': {
                    id: 'rest-store',
                    label: 'Rest Store',
                    fields: ['remote-servers', 'path', 'append-cache-name-to-path']
                },
                'string-keyed-jdbc-store': {
                    id: 'string-keyed-jdbc-store',
                    label: 'String Keyed JDBC Store',
                    fields: ['datasource', 'dialect']
                }
            };
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    metadata: '=',
                    cacheType: '=',
                    initDefaults: '=',
                    readOnly: '=',
                    outsideController: '='
                },
                replace: true,
                templateUrl: 'components/directives/cache/store/cache-store.html',
                link: function (scope) {
                    scope.init = function () {
                        scope.initInternalcontroller();
                        scope.resourceDescriptionMap = {};
                        utils.makeResourceDescriptionMap(scope.resourceDescriptionMap);
                        scope.metadata.storeTypes = storeFields;
                        scope.metadata.checkboxes = scope.getCommonStoreCheckboxes();
                        if (utils.isNullOrUndefined(scope.data)) {
                            scope.data = {};
                        }
                        var storeType = scope.getStoreType();
                        scope.data['store-type'] = storeType;
                        scope.data['is-new-node'] = scope.isNoStoreSelected();
                        scope.fields = storeFields[storeType].fields;
                        // Copy so that scope.metadata.currentStore is just reloaded when this directive is initialised
                        scope.metadata.currentStore = scope.isNoStoreSelected() ? {} : angular.copy(scope.resolveDescription(storeType));
                        scope.store = scope.getStoreObject();
                        scope.store['is-new-node'] = scope.isNoStoreSelected();
                        scope.storeView = scope.getStoreView(storeType);
                        // Create children meta and data objects as they are not in the metadata by default
                        scope.initWriteBehindData();
                        scope.initLevelDbChildrenAndMeta(storeType, true);
                        scope.cleanMetadataAndPrevValues();
                    };
                    scope.initInternalcontroller = function () {
                        if (utils.isNotNullOrUndefined(scope.outsideController)) {
                            if (utils.isArray(scope.outsideController)) {
                                var handle = {};
                                scope.outsideController.push(handle);
                                scope.internalController = handle;
                            }
                            else {
                                scope.internalController = scope.outsideController;
                            }
                        }
                        else {
                            scope.internalController = {};
                        }
                        scope.internalController.requiresRestart = scope.requiresRestart;
                    };
                    scope.initWriteBehindData = function (typeHasChanged) {
                        if (scope.isNoStoreSelected()) {
                            return; // Do nothing as this wb data and meta is not required
                        }
                        var storeMeta = scope.metadata.currentStore;
                        if (utils.isNullOrUndefined(storeMeta['write-behind'])) {
                            var meta = angular.copy(utils.resolveDescription(scope.metadata, scope.resourceDescriptionMap, 'write-behind', scope.cacheType));
                            scope.addModelChildToMetaAndStore('write-behind', meta, scope.store, storeMeta, typeHasChanged);
                        }
                        if (typeHasChanged) {
                            scope.store['write-behind']['WRITE_BEHIND']['is-new-node'] = true;
                        }
                    };
                    scope.initLevelDbChildrenAndMeta = function (storeType) {
                        if (scope.isNoStoreSelected() || storeType !== 'leveldb-store') {
                            return;
                        }
                        var meta = angular.copy(utils.resolveDescription(scope.metadata, scope.resourceDescriptionMap, 'leveldb-children', scope.cacheType));
                        delete meta['write-behind']; // Remove so we don't overwrite existing field on merge
                        delete meta['property'];
                        for (var key in meta) {
                            scope.addModelChildToMetaAndStore(key, meta, scope.store, scope.metadata.currentStore);
                        }
                        // Init levelDb select ng-models. Can't use store object directly as it does not allow existing values to
                        // be the initially selected option.
                        scope.levelDb = {};
                        scope.levelDb.impl = utils.deepGet(scope.store, 'implementation.IMPLEMENTATION');
                        scope.levelDb.comp = utils.deepGet(scope.store, 'compression.COMPRESSION');
                    };
                    scope.addModelChildToMetaAndStore = function (key, childMeta, store, storeMeta) {
                        var objectKey = scope.getStoreObjectKey(key);
                        var path = utils.createPath('.', [key, 'model-description', objectKey]);
                        var innerMeta = utils.deepGet(childMeta, path);
                        innerMeta.attributes.description = innerMeta.description;
                        if (utils.isNullOrUndefined(innerMeta.attributes.type)) {
                            // We need this for undoFieldChange type check write-behind and other children stored as objects
                            innerMeta.attributes.type = { TYPE_MODEL_VALUE: 'OBJECT' };
                        }
                        storeMeta[key] = innerMeta.attributes;
                        // If no existing values for field, create empty objects
                        if (utils.isNullOrUndefined(store[key]) || utils.isNullOrUndefined(store[key][objectKey])) {
                            store[key] = {};
                            store[key][objectKey] = { 'is-new-node': true };
                        }
                        // Set default values for values shown as list
                        for (var attributeKey in innerMeta.attributes) {
                            var attribute = innerMeta.attributes[attributeKey];
                            if (utils.isNotNullOrUndefined(attribute) && utils.isNotNullOrUndefined(attribute.allowed) &&
                                utils.isNullOrUndefined(store[key][objectKey][attributeKey])) {
                                store[key][objectKey][attributeKey] = attribute.default;
                            }
                        }
                    };
                    scope.updateStoreAttributesAndMeta = function (newStoreType, oldStoreType) {
                        var noPrevStore = utils.isNotNullOrUndefined(oldStoreType) && oldStoreType === 'None';
                        var oldMeta = scope.metadata.currentStore;
                        var newMeta = angular.copy(scope.resolveDescription(newStoreType));
                        if (!noPrevStore) {
                            if (utils.isNotNullOrUndefined(newMeta)) {
                                angular.forEach(scope.store, function (value, key) {
                                    if (customStoreFields.indexOf(key) < 0) {
                                        if (key !== 'write-behind' && !newMeta.hasOwnProperty(key)) {
                                            delete scope.store[key];
                                        }
                                        else if (utils.isNotNullOrUndefined(oldMeta)) {
                                            newMeta[key] = oldMeta[key];
                                        }
                                    }
                                });
                            }
                            scope.data[oldStoreType] = null;
                        }
                        scope.fields = storeFields[newStoreType].fields;
                        scope.metadata.currentStore = newMeta;
                        var newType = newStoreType !== oldStoreType;
                        scope.initWriteBehindData(newType);
                        scope.initLevelDbChildrenAndMeta(newStoreType, newType);
                    };
                    scope.cleanMetadataAndPrevValues = function () {
                        scope.prevData = {};
                        angular.forEach(scope.metadata.currentStore, function (value, key) {
                            if (utils.isObject(value)) {
                                utils.makeFieldClean(value);
                                scope.prevData[key] = angular.copy(scope.store[key]);
                            }
                        });
                        scope.prevData['store-type'] = scope.data['store-type'];
                        scope.metadata['store-type'] = {
                            uiModified: false,
                            style: null
                        };
                        scope.data['store-original-type'] = scope.prevData['store-type'];
                    };
                    scope.getCurrentStoreType = function () {
                        return data['store-type'];
                    };
                    scope.updateStoreType = function () {
                        var storeType = scope.data['store-type'];
                        var previousStore = scope.store;
                        var previousType = scope.prevType; // Defined in ng-init as workaround for previous val
                        var storeTypeChanged = scope.prevData['store-type'] !== storeType;
                        if (storeTypeChanged) {
                            utils.makeFieldDirty(scope.metadata['store-type'], 'store-type', true, scope);
                            scope.$emit('configurationFieldDirty', storeType);
                        }
                        else {
                            utils.makeFieldClean(scope.metadata['store-type'], 'store-type', true, scope);
                        }
                        scope.storeView = scope.getStoreView(storeType);
                        if (scope.isNoStoreSelected()) {
                            scope.metadata.currentStore = {};
                            return;
                        }
                        var storeKey = scope.getStoreObjectKey(storeType);
                        scope.updateStoreAttributesAndMeta(storeType, previousType);
                        scope.data[storeType] = {};
                        scope.data[storeType][storeKey] = utils.isNotNullOrUndefined(previousStore) ? previousStore : {};
                        scope.data['is-new-node'] = storeTypeChanged;
                        scope.store = scope.data[storeType][storeKey];
                        scope.store['is-new-node'] = storeTypeChanged;
                    };
                    scope.undoStoreTypeChange = function () {
                        var currentStoreType = scope.data['store-type'];
                        var originalStoreType = scope.prevData['store-type'];
                        var nonNullStore = originalStoreType !== 'None';
                        if (nonNullStore) {
                            var originalStoreKey = scope.getStoreObjectKey(originalStoreType);
                            scope.data[originalStoreType] = {};
                            scope.data[originalStoreType][originalStoreKey] = scope.store;
                            scope.storeView = scope.getStoreView(originalStoreType);
                        }
                        scope.data['store-type'] = originalStoreType;
                        scope.data['is-new-node'] = !nonNullStore;
                        scope.updateStoreAttributesAndMeta(originalStoreType, currentStoreType);
                        utils.makeFieldClean(scope.getFieldMetaObject('store-type'), 'store-type', true, scope);
                    };
                    scope.getStoreType = function () {
                        for (var key in scope.metadata.storeTypes) {
                            var store = scope.data[key];
                            if (utils.isNotNullOrUndefined(store)) {
                                var storeObject = store[scope.getStoreObjectKey(key)];
                                if (Object.keys(storeObject).length > 1) {
                                    return key;
                                }
                            }
                        }
                        return 'None';
                    };
                    scope.getStoreView = function (storeType) {
                        var viewDir = 'components/directives/cache/store/views/';
                        switch (storeType) {
                            case 'None':
                                return null;
                            case 'string-keyed-jdbc-store':
                            case 'binary-keyed-jdbc-store':
                            case 'mixed-keyed-jdbc-store':
                                return viewDir + 'jdbc-store.html';
                            default:
                                return viewDir + storeType + '.html';
                        }
                    };
                    scope.getCommonStoreCheckboxes = function () {
                        var boxes = [];
                        var genericStoreMeta = scope.resolveDescription('store');
                        angular.forEach(genericStoreMeta, function (value, key) {
                            var type = value['type'];
                            var deprecated = utils.isNotNullOrUndefined(value['deprecated']);
                            if (utils.isNotNullOrUndefined(type)) {
                                var modelType = type['TYPE_MODEL_VALUE'];
                                if (utils.isNotNullOrUndefined(modelType) && modelType === 'BOOLEAN' && !deprecated) {
                                    boxes.push(key);
                                }
                            }
                        });
                        return boxes;
                    };
                    scope.isNoStoreSelected = function () {
                        return scope.data['store-type'] === 'None';
                    };
                    scope.getStoreObject = function () {
                        var storeKey = scope.data['store-type'];
                        if (scope.isNoStoreSelected()) {
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
                    scope.requiresRestart = function () {
                        var restartRequired = scope.prevData['store-type'] !== scope.data['store-type'];
                        if (restartRequired) {
                            return true;
                        }
                        if (utils.isNotNullOrUndefined(scope.metadata.currentStore)) {
                            return Object.keys(scope.metadata.currentStore).some(function (field) {
                                var meta = scope.getFieldMetaObject(field);
                                return utils.isFieldValueModified(meta) && utils.fieldChangeRequiresRestart(meta);
                            });
                        }
                        return false;
                    };
                    scope.resolveDescription = function (elementPath) {
                        if (utils.isNotNullOrUndefined(elementPath) && elementPath !== 'None') {
                            return utils.resolveDescription(scope.metadata, scope.resourceDescriptionMap, elementPath, scope.cacheType);
                        }
                    };
                    scope.getFieldMetaObject = function (field, parent) {
                        var meta = scope.metadata.currentStore;
                        if (utils.isNotNullOrUndefined(parent)) {
                            return meta[parent][field];
                        }
                        return scope.metadata.hasOwnProperty(field) ? scope.metadata[field] : scope.metadata.currentStore[field];
                    };
                    scope.getFieldMetaValues = function (field) {
                        return scope.getFieldMetaObject(field)['value-type'];
                    };
                    // Different to normal fields as we have to ensure that only the actual ng-model value is changed
                    scope.undoLevelDbSelectChange = function (field, parent) {
                        var path = utils.createPath('.', [parent, scope.getStoreObjectKey(parent)]);
                        var storeObject = utils.deepGet(scope.store, path);
                        var prevObject = utils.deepGet(scope.prevData, path);
                        if (utils.isNullOrUndefined(prevObject)) {
                            // If no prevVal exists, then restore to the default value
                            var meta = scope.getFieldMetaObject(field, parent);
                            storeObject[field] = angular.copy(meta.default);
                        }
                        else {
                            storeObject[field] = angular.copy(prevObject[field]);
                        }
                    };
                    scope.getLevelDbPrevVal = function (field, parent) {
                        var path = utils.createPath('.', [parent, scope.getStoreObjectKey(parent)]);
                        var prevObject = utils.deepGet(scope.prevData, path);
                        return utils.isNotNullOrUndefined(prevObject) ? prevObject[field] : undefined;
                    };
                    // Workaround methods as we cannot (AFAIK) pass parameters with callback functions
                    scope.undoLdbImplementationChange = function () {
                        scope.undoLevelDbSelectChange('implementation', 'implementation');
                    };
                    scope.undoLdbCompressionChange = function () {
                        scope.undoLevelDbSelectChange('type', 'compression');
                    };
                    // Initialise scope variables
                    scope.init();
                }
            };
        }
    ]);
}());
//# sourceMappingURL=cache-store.js.map