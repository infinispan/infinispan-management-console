'use strict';

angular.module('managementConsole.api')
  .factory('cacheCreateController', [
    '$http',
    '$q',
    'modelController',
    'utils',
    function ($http, $q, modelController, utils) {

      /**
       * Represents a client to the cacheCreateController
       *
       * @constructor
       * @param {string} url - the URL to the ModelController management endpoint
       */
      var CacheCreationControllerClient = function (url) {
        this.url = url + '/management';
      };


      /**
       *
       * Executes an operation
       *
       * @param data
       * @param callback
       */
      CacheCreationControllerClient.prototype.execute = function (op) {
        return modelController.execute(op);
      };

      CacheCreationControllerClient.prototype.emptyPromise = function () {
        var deferred = $q.defer();
        return deferred.promise;
      };


      /**
       *
       * Creates a cache at a given DMR address a configuration structure cacheConfiguration
       *
       * @param address DMR address of the cache
       * @param cacheConfiguration configuration
       * @param callback to execute at the end of create operation
       */
      CacheCreationControllerClient.prototype.createCacheFromTemplate = function (address, template) {
        var op = {
          'operation': 'add',
          'configuration': template,
          'address': address
        };
        return this.execute(op);
      };

      /**
       *
       * Creates a cache configuration template at a given DMR address and configuration model
       *
       * @param address DMR address of the cache
       * @param cacheConfiguration configuration
       */
      CacheCreationControllerClient.prototype.createCacheConfigurationTemplate = function (address, cacheConfiguration) {
        return this.createConfigurationTemplate(address, cacheConfiguration);
      };

      /**
       * Returns defined configuration templates for the the given cache type
       *
       *
       * @param cacheType One of distributed-cache, invalidation-cache, local-cache or replicated-cache
       */
      CacheCreationControllerClient.prototype.getConfigurationTemplates = function (profile, cacheContainer, cacheType) {
        var deferred = $q.defer();
        var dmrConfigurationsAddress = ['profile', profile , 'subsystem', 'datagrid-infinispan',
          'cache-container', cacheContainer, 'configurations', 'CONFIGURATIONS', cacheType + '-configuration'];
        modelController.readResource(dmrConfigurationsAddress, true, false).then(function (response) {
          deferred.resolve(response);
        }.bind(this));
        return deferred.promise;
      };

      /**
       * Returns defined configuration template
       *
       *
       * @param cacheType One of distributed-cache, invalidation-cache, local-cache or replicated-cache
       */
      CacheCreationControllerClient.prototype.getConfigurationTemplate = function (profile, cacheContainer, cacheType, cacheTemplateName) {
        var deferred = $q.defer();
        var dmrConfigurationsAddress = ['profile', profile , 'subsystem', 'datagrid-infinispan',
          'cache-container', cacheContainer, 'configurations', 'CONFIGURATIONS', cacheType + '-configuration', cacheTemplateName];
        modelController.readResource(dmrConfigurationsAddress, true, false).then(function (response) {
          deferred.resolve(response);
        }.bind(this));
        return deferred.promise;
      };


      /**
       *
       * Creates a replicated/distributed cache at a given DMR address a and a cache configuration structure
       *
       * @param cache cache configuration
       * @param address DMR address of the cache
       * @param cacheType cache type to create
       */
      CacheCreationControllerClient.prototype.createConfigurationTemplate = function (address, configuration, cacheType) {
        var steps = [];
        var compositeOp = {
          operation:'composite',
          address: [],
          steps:steps
        };

        return this.createCacheConfigurationNode(address, configuration).then(function () {
          this.createHelper(steps, address.concat('locking', 'LOCKING'), configuration.locking);
          this.createHelper(steps, address.concat('eviction', 'EVICTION'), configuration.eviction);
          this.createHelper(steps, address.concat('expiration', 'EXPIRATION'), configuration.expiration);
          this.createHelper(steps, address.concat('indexing', 'INDEXING'), configuration.indexing);
          this.createHelper(steps, address.concat('compatibility', 'COMPATIBILITY'), configuration.compatibility);
          this.createHelper(steps, address.concat('partition-handling', 'PARTITION_HANDLING'), configuration['partition-handling']);
          this.createHelper(steps, address.concat('transaction', 'TRANSACTION'), configuration.transaction);
          this.createHelper(steps, address.concat('state-transfer', 'STATE_TRANSFER'), configuration['state-transfer']);
          this.createHelper(steps, address.concat('loader', 'LOADER'), configuration.loader);
          this.createHelper(steps, address.concat('backup', 'BACKUP'), configuration.backup);

          this.createHelper(steps, address.concat('security', 'SECURITY'), configuration.security);
          this.createHelper(steps, address.concat('security', 'SECURITY', 'authorization', 'AUTHORIZATION'), configuration.security.SECURITY.authorization);

          this.createCacheStore(steps, address, configuration);
          //ok now, lets send composite op to server
          return this.execute(compositeOp);
        }.bind(this));
      };

      CacheCreationControllerClient.prototype.createHelper = function (steps, address, configurationElement) {
        //'is-new-node' is special attribute denoting node being created rather than modified
        //'type' is special attribute denoting type of store
        // all exclusionList elements are not native to DMR
        if (utils.isNotNullOrUndefined(configurationElement)) {
          // ISPN-6587: Exclude type from the exclusion list for EVICTION objects, as EVICTION.type exists.
          var exclusionList = ['is-new-node', 'store-type', 'store-original-type'];
          if (utils.isNullOrUndefined(configurationElement['EVICTION']) && utils.isNullOrUndefined(configurationElement['COMPRESSION'])) {
            exclusionList.push('type');
          }
          this.addNodeComposite(steps, address, configurationElement, exclusionList, true);
        }

      };

      CacheCreationControllerClient.prototype.createCacheStore = function(steps, address, configuration) {
        var storeType = configuration['store-type'];
        if (utils.isNullOrUndefined(storeType) || storeType === 'None' || utils.isNullOrUndefined(configuration[storeType])) {
          return;
        }

        // Add step to create/update store
        var objectKey = storeType.toUpperCase().replace(/-/g, '_');
        configuration[storeType][objectKey]['required-node'] = true;
        this.createHelper(steps, address.concat(storeType, objectKey), configuration[storeType]);

        // Add all children objects
        var store = configuration[storeType][objectKey];
        if (utils.isNotNullOrUndefined(store)) {
          for (var key in store) {
            var nestedObject = store[key];
            if (utils.isObject(nestedObject)) {
              var nestedKey = key.toUpperCase().replace(/-/g, '_');
              if (utils.isNotNullOrUndefined(nestedObject[nestedKey])) {
                var nestedAddress = address.concat(storeType, objectKey, key, nestedKey);
                this.updateHelper(steps, nestedAddress, nestedObject);
              }
            }
          }
        }
      };

      /**
       *
       * Updates a replicated/distributed cache at a given DMR address a and a cache configuration structure
       *
       * @param cache cache configuration
       * @param address DMR address of the cache
       * @param cacheType cache type to create
       */
      CacheCreationControllerClient.prototype.updateConfigurationTemplate = function (address, configuration, cacheType) {
        var steps = [];
        var compositeOp = {
          operation:'composite',
          address: [],
          steps:steps
        };
        return this.updateCacheConfigurationNode(address, configuration).then(function () {
          this.updateHelper(steps, address.concat('locking', 'LOCKING'), configuration.locking);
          this.updateHelper(steps, address.concat('eviction', 'EVICTION'), configuration.eviction);
          this.updateHelper(steps, address.concat('expiration', 'EXPIRATION'), configuration.expiration);
          this.updateHelper(steps, address.concat('indexing', 'INDEXING'), configuration.indexing);
          this.updateHelper(steps, address.concat('compatibility', 'COMPATIBILITY'), configuration.compatibility);
          this.updateHelper(steps, address.concat('partition-handling', 'PARTITION_HANDLING'), configuration['partition-handling']);
          this.updateHelper(steps, address.concat('transaction', 'TRANSACTION'), configuration.transaction);
          this.updateHelper(steps, address.concat('state-transfer', 'STATE_TRANSFER'), configuration['state-transfer']);
          this.updateHelper(steps, address.concat('loader', 'LOADER'), configuration.loader);
          this.updateHelper(steps, address.concat('backup', 'BACKUP'), configuration.backup);

          this.updateSecurityAuthorization(configuration);
          this.updateHelper(steps, address.concat('security', 'SECURITY'), configuration.security);
          this.updateHelper(steps, address.concat('security', 'SECURITY', 'authorization', 'AUTHORIZATION'), configuration.security.SECURITY.authorization);

          this.updateCacheStore(steps, address, configuration);

          //ok now, lets send composite op to server
          return this.execute(compositeOp);
        }.bind(this));
      };

      CacheCreationControllerClient.prototype.updateHelper = function (steps, address, configurationElement) {
        //'is-new-node' is special attribute denoting node being created rather than modified
        //'type' is special attribute denoting type of store
        // all exclusionList elements are not native to DMR
        if (utils.isNotNullOrUndefined(configurationElement)) {
          // ISPN-6587: Exclude type from the exclusion list for EVICTION objects, as EVICTION.type exists.
          // Same for LevelDB->Compression. TODO need a better way to make exceptions
          var exclusionList = ['is-new-node', 'store-type', 'store-original-type'];
          if (utils.isNullOrUndefined(configurationElement['EVICTION']) && utils.isNullOrUndefined(configurationElement['COMPRESSION'])) {
            exclusionList.push('type');
          }
          this.addNodeComposite(steps, address, configurationElement, exclusionList);
        }
      };

      CacheCreationControllerClient.prototype.updateCacheStore = function(steps, address, configuration) {
        var newStoreType = configuration['store-type'];
        var originalStoreType = configuration['store-original-type'];
        var newStore = newStoreType !== originalStoreType;

        // Add step to create/update JDBC store
        if (newStoreType !== 'None') {
          // We update the store followed by all of its children
          var objectKey = newStoreType.toUpperCase().replace(/-/g, '_');
          if (newStore) {
            configuration[newStoreType][objectKey]['required-node'] = true;
          }
          this.updateHelper(steps, address.concat(newStoreType, objectKey), configuration[newStoreType], newStore);

          // Update all children objects
          var store = configuration[newStoreType][objectKey];
          if (utils.isNotNullOrUndefined(store)) {
            for (var key in store) {
              var nestedObject = store[key];
              if (utils.isObject(nestedObject)) {
                var nestedKey = key.toUpperCase().replace(/-/g, '_');
                if (utils.isNotNullOrUndefined(nestedObject[nestedKey])) {
                  var nestedAddress = address.concat(newStoreType, objectKey, key, nestedKey);
                  this.updateHelper(steps, nestedAddress, nestedObject);
                }
              }
            }
          }
        }

        // If a new Store type has been specified (can be None), then remove the previous store's configuration
        if (utils.isNotNullOrUndefined(originalStoreType) && originalStoreType !== 'None'
        && newStore) {
          var op = {
            'operation': 'remove',
            'address': address.concat(originalStoreType, originalStoreType.toUpperCase().replace(/-/g, '_'))
          };
          steps.push(op);
        }
      };

      /**
       * Creates new distributed cache with given parameters
       *
       *
       * @param address
       *
       * Parameter @param prop has the following properties:
       *
       * mode STRING  Sets the clustered cache mode, ASYNC for asynchronous operation, or SYNC for synchronous operation.
       *
       *  module  STRING  The module whose class loader should be used when building this cache's configuration
       *  remote_cache  STRING  The name of the remote cache that backups data here
       *  segments  INT  Controls the number of hash space segments which is the granularity for key distribution
       * in the cluster. Value must be strictly positive.
       *  indexing STRING  If enabled, entries will be indexed when they are added to the cache.
       * Indexes will be updated as entries change or are removed.
       *
       *  auto-config  BOOLEAN  If enabled, will configure indexing automatically based on cache type
       *  statistics  BOOLEAN  If enabled, statistics will be collected for this cache
       *  remote-timeout  LONG  In SYNC mode, the timeout (in ms) used to wait for an acknowledgment when making
       * a remote call, after which the call is aborted and an exception is thrown.
       *
       *  capacity-factor  DOUBLE  Controls the proportion of entries that will reside on the local node, compared
       * to the other nodes in the cluster. Value must be positive. This element is only used in 'distributed' cache instances.
       *
       *  batching  BOOLEAN  If enabled, the invocation batching API will be made available for this cache.
       *  start  STRING  The cache start mode, which can be EAGER (immediate start) or LAZY (on-demand start).
       *  l1-lifespan  LONG  Maximum lifespan of an entry placed in the L1 cache. This element configures the L1 cache
       * behavior in 'distributed' caches instances. In any other cache modes, this element is ignored.
       *
       *  remote-site  STRING  The name of the remote site containing the cache that backups data here.
       *  jndi-name  STRING  The jndi-name to which to bind this cache instance.
       *  async-marshalling  BOOLEAN  If enabled, this will cause marshalling of entries to be performed asynchronously.
       * replication queue runs. This should be a positive integer which represents thread wakeup time in milliseconds.
       *
       *  owners  INT  Number of cluster-wide replicas for each cache entry.
       *
       *
       */
      CacheCreationControllerClient.prototype.createCacheConfigurationNode = function (address, prop) {
        // remove DMR attributes we added when we loaded the model
        return this.executeAddOperation(address, prop, ['name','type','template-name']);
      };

      CacheCreationControllerClient.prototype.updateCacheConfigurationNode = function (address, prop) {
        var steps = [];
        var compositeOp = {
          operation:'composite',
          address: [],
          steps:steps
        };
        if (utils.isNotNullOrUndefined(prop)) {
          this.composeWriteAttributeOperations(steps, address, prop, ['name','type','template-name', 'is-new-node',
          'is-create-with-bare-template', 'is-create-mode', 'store-type', 'store-original-type', 'required-node']);
          this.composeWriteObjectOperations(steps, address, prop, ['indexing-properties', 'string-keyed-table', 'binary-keyed-table']);
        }
        return this.execute(compositeOp);
      };

      CacheCreationControllerClient.prototype.removeCacheConfigurationNode = function (profile, cacheContainer, cacheType, templateName) {
        var dmrConfigurationsAddress = ['profile', profile , 'subsystem', 'datagrid-infinispan',
          'cache-container', cacheContainer , 'configurations', 'CONFIGURATIONS', cacheType + '-configuration', templateName];
        // remove DMR attributes we added when we loaded the model
        var op = {
          'operation': 'remove',
          'address': dmrConfigurationsAddress
        };
        return this.execute(op);
      };


      CacheCreationControllerClient.prototype.addNodeComposite = function (steps, address, prop, excludeAttributeList, forceOp) {
        //peek the last element of the address array but do not pop it
        var modelNode = address.slice(-1).pop();
        if (utils.isNotNullOrUndefined(prop) && prop.hasOwnProperty(modelNode)) {
          this.addCompositeOperation(steps, address, prop[modelNode], excludeAttributeList, forceOp);
        }
      };

      CacheCreationControllerClient.prototype.executeAddOperation = function (address, prop, excludeAttributeList, forceExecution) {
        forceExecution = (typeof forceExecution === 'undefined') ? false : forceExecution;
        var op = this.createAddOperation(address, prop, excludeAttributeList);
        if (Object.keys(op).length > 2 || forceExecution) {
          //ok cool, we actually have more op parameter fields besides address and operation
          //therefore - execute this op
          return this.execute(op);
        } else {
          return this.emptyPromise();
        }
      };

      CacheCreationControllerClient.prototype.addCompositeOperation = function (steps, address, prop, excludeAttributeList, forceAdd) {
        forceAdd = (typeof forceAdd === 'undefined') ? false : forceAdd;
        var createAddOperation = forceAdd || prop['is-new-node']; //TODO make is-new-node a constant somewhere
        if (createAddOperation) {
          var op = this.createAddOperation(address, prop, excludeAttributeList);
          if (Object.keys(op).length > 2 || prop['required-node']) {
            //ok cool, we actually have at least address and operation
            //therefore - add this op to composite steps
            // Or if 'required-node' is present, then we know that this node must be forced even if empty
            // (required for when child nodes may also have been defined without the parent)
            steps.push(op);
          }
        } else {
          //otherwise we just overwrite all attributes with new values
          var allowedObjects = ['indexing-properties', 'string-keyed-table', 'binary-keyed-table'];
          this.composeWriteAttributeOperations(steps, address, prop, excludeAttributeList);
          this.composeWriteObjectOperations(steps, address, prop, allowedObjects);
        }
      };

      CacheCreationControllerClient.prototype.createAddOperation = function (address, prop, excludeAttributeList) {
        var allowedObjects = ['indexing-properties', 'string-keyed-table', 'binary-keyed-table'];
        //minimal DMR op structure
        var op = {
          'operation': 'add',
          'address': address
        };

        //copy all non complex attributes found at prop into op
        if (utils.isNotNullOrUndefined(prop)) {
          //iterate properties of model object and append (key/value) properties to op object
          var keys = Object.keys(prop);
          for (var i = 0; i < keys.length; i++) {
            var propKey = keys[i];
            var propValue = prop[keys[i]];
            if (utils.isNotNullOrUndefined(propValue)) {
              if (utils.isObject(propValue)) {
                // Only process allowed objects, these should be objects which are dmr attributes not children
                if (allowedObjects.indexOf(propKey) > -1) {
                  op[propKey] = propValue;
                }
              } else {
                //assign only primitives (strings, numbers, integers)
                // i.e disregard potential branches of prop object tree

                //handle JSON described objects
                if (utils.isString(propValue)) {
                  if ((propValue.indexOf('{') > -1 && propValue.indexOf('}') > -1) ||
                    (propValue.indexOf('[') > -1 && propValue.indexOf(']') > -1)) {
                    try {
                      op[propKey] = JSON.parse(propValue);
                    }
                    catch (e) {
                      console.log('Invalid JSON value ' + propValue + ' for field ' + propKey);
                    }
                  }
                  //simple strings
                  else {
                    op[propKey] = propValue;
                  }
                }
                // numbers, integers, booleans etc
                else {
                  op[propKey] = propValue;
                }
              }
            }
          }
        }
        //and remove attributes from exclusion list (if any)
        angular.forEach(excludeAttributeList, function (attribute){
          delete op[attribute];
        });
        return op;
      };

      CacheCreationControllerClient.prototype.composeWriteAttributeOperations = function (steps, address, prop, excludeAttributeList) {

        //copy all non complex attributes found at prop into op
        if (utils.isNotNullOrUndefined(prop)) {

          //iterate properties of model object and append (key/value) properties to op object
          var keys = Object.keys(prop);
          for (var i = 0; i < keys.length; i++) {
            var propKey = keys[i];
            var propValue = prop[keys[i]];
            var excludeAttribute = excludeAttributeList.some(function (attribute){ return propKey === attribute;});
            if(!excludeAttribute) {
              if (utils.isNotNullOrUndefined(propValue) && !utils.isObject(propValue)) {
                //assign only primitives (strings, numbers, integers)
                // i.e disregard potential branches of prop object tree

                //handle JSON described objects
                if (utils.isString(propValue)) {
                  if ((propValue.indexOf('{') > -1 && propValue.indexOf('}') > -1) ||
                    (propValue.indexOf('[') > -1 && propValue.indexOf(']') > -1)) {
                    try {
                      steps.push(this.createCompositeWriteAttributeOperation(address, propKey, JSON.parse(propValue)));
                    }
                    catch (e) {
                      console.log('Invalid JSON value ' + propValue + ' for field ' + propKey);
                    }
                  }
                  //simple strings
                  else {
                    steps.push(this.createCompositeWriteAttributeOperation(address, propKey, propValue));
                  }
                }
                // numbers, integers, booleans etc
                else {
                  steps.push(this.createCompositeWriteAttributeOperation(address, propKey, propValue));
                }
              }
            }
          }
        }
      };

      CacheCreationControllerClient.prototype.createCompositeWriteAttributeOperation = function (address, attributeName, attributeValue) {
        return {
          operation: 'write-attribute',
          address: address,
          name: attributeName,
          value: attributeValue
        }
      };

      CacheCreationControllerClient.prototype.composeWriteObjectOperations = function (steps, address, prop, includedAttributes) {
        if (utils.isNotNullOrUndefined(prop)) {
          var keys = Object.keys(prop);
          for (var i = 0; i < keys.length; i++) {
            var propKey = keys[i];
            var propValue = prop[keys[i]];
            var includedAttribute = includedAttributes.some(function (attribute){ return propKey === attribute;});
            if(includedAttribute) {
              if (utils.isNotNullOrUndefined(propValue) && utils.isObject(propValue)) {
                steps.push(this.createCompositeWriteAttributeOperation(address, propKey, propValue))
              }
            }
          }
        }
      };

      CacheCreationControllerClient.prototype.updateSecurityAuthorization = function(conf) {
        //if we are creating new node AUTHORIZATION for a template conf we have to flag its ancestor SECURITY as new node as well
        var auth = utils.deepValue(conf.security, 'SECURITY.authorization.AUTHORIZATION');
        if (utils.isNotNullOrUndefined(auth) && auth['is-new-node'] && auth['enabled']) {
          var sec = utils.deepValue(conf.security, 'SECURITY');
          sec['is-new-node'] = true;
        }
      };

      // IE won't support window.location.origin
      var windowOrigin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

      return new CacheCreationControllerClient(windowOrigin);
    }
  ]);
