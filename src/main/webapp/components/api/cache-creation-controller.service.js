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
       * Creates a cache at a given DMR address a configuration structure cacheConfiguration
       *
       * @param address DMR address of the cache
       * @param cacheConfiguration configuration
       * @param callback to execute at the end of create operation
       */
      CacheCreationControllerClient.prototype.createCacheConfigurationTemplate = function (address, cacheConfiguration, cacheType) {
        if (cacheType === 'distributed-cache' || cacheType === 'replicated-cache') {
          return this.createReplicatedOrDistributedCacheConfigurationTemplate(cacheConfiguration, address, cacheType);
        } else if (cacheConfiguration.type === 'invalidation-cache' || cacheConfiguration.type === 'local-cache') {
          return this.createInvalidationOrLocalCacheConfigurationTemplate(cacheConfiguration, address, cacheType);
        }
      };

      /**
       * Returns defined configuration templates for the the given cache type
       *
       *
       * @param cacheType One of distributed-cache, invalidation-cache, local-cache or replicated-cache
       */
      CacheCreationControllerClient.prototype.getConfigurationTemplates = function (cacheContainer, cacheType) {
        var deferred = $q.defer();
        var dmrConfigurationsAddress = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan',
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
      CacheCreationControllerClient.prototype.getConfigurationTemplate = function (cacheContainer, cacheType, cacheTemplateName) {
        var deferred = $q.defer();
        var dmrConfigurationsAddress = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan',
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
       * @param callback to execute at the end of create operation
       */
      CacheCreationControllerClient.prototype.createConfigurationTemplateBare = function (configuration, address, cacheType) {
        var promise = this.createCacheConfigurationNode(address, configuration);
        return promise.then(function () {
          if (utils.isNotNullOrUndefined(configuration.locking)) {
            this.addNode(address.concat('locking', 'LOCKING'), configuration.locking);
          }
          if (utils.isNotNullOrUndefined(configuration.eviction)) {
            this.addNode(address.concat('eviction', 'EVICTION'), configuration.eviction);
          }
          if (utils.isNotNullOrUndefined(configuration.expiration)) {
            this.addNode(address.concat('expiration', 'EXPIRATION'), configuration.expiration);
          }
          if (utils.isNotNullOrUndefined(configuration.compatibility)) {
            this.addNode(address.concat('compatibility', 'COMPATIBILITY'), configuration.compatibility);
          }
          if (utils.isNotNullOrUndefined(configuration['partition-handling'])) {
            this.addNode(address.concat('partition-handling', 'PARTITION_HANDLING'), configuration['partition-handling']);
          }
          if (utils.isNotNullOrUndefined(configuration.transaction)) {
            this.addNode(address.concat('transaction', 'TRANSACTION'), configuration.transaction);
          }
          if (utils.isNotNullOrUndefined(configuration['state-transfer'])) {
            this.addNode(address.concat('state-transfer', 'STATE_TRANSFER'), configuration['state-transfer']);
          }
          if (utils.isNotNullOrUndefined(configuration.loader)) {
            this.addNode(address.concat('loader', 'LOADER'), configuration.loader);
          }
          if (utils.isNotNullOrUndefined(configuration.store)) {
            this.addNode(address.concat('store', 'STORE'), configuration.store);
          }
          if (utils.isNotNullOrUndefined(configuration['file-store'])) {
            this.addNode(address.concat('file-store', 'FILE_STORE'), configuration['file-store']);
          }
          if (utils.isNotNullOrUndefined(configuration['leveldb-store'])) {
            this.addNode(address.concat('leveldb-store', 'LEVEL_DB_STORE'), configuration['leveldb-store']);
          }
          if (utils.isNotNullOrUndefined(configuration['string-keyed-jdbc-store'])) {
            this.addNode(address.concat('string-keyed-jdbc-store', 'STRING_KEYED_JDBC_STORE'), configuration['string-keyed-jdbc-store'], ['type']);
          }
          if (utils.isNotNullOrUndefined(configuration['binary-keyed-jdbc-store'])) {
            this.addNode(address.concat('binary-keyed-jdbc-store', 'BINARY_KEYED_JDBC_STORE'), configuration['binary-keyed-jdbc-store'], ['type']);
          }
          if (utils.isNotNullOrUndefined(configuration['mixed-keyed-jdbc-store'])) {
            this.addNode(address.concat('mixed-keyed-jdbc-store', 'MIXED_KEYED_JDBC_STORE'), configuration['mixed-keyed-jdbc-store'], ['type']);
          }
          if (utils.isNotNullOrUndefined(configuration.backup)) {
            this.addNode(address.concat('backup', 'BACKUP'), configuration.backup);
          }
          if (utils.isNotNullOrUndefined(configuration.security)) {
            this.addNode(address.concat('security', 'SECURITY'), configuration.security, [], true).then(function () {
              this.addNode(address.concat('security', 'SECURITY', 'authorization', 'AUTHORIZATION'), configuration.security.SECURITY.authorization);
            }.bind(this));
          }
        }.bind(this));
      };

      CacheCreationControllerClient.prototype.createReplicatedOrDistributedCacheConfigurationTemplate = function (configuration, address, cacheType) {
        return this.createConfigurationTemplateBare(configuration, address, cacheType);
      };

      CacheCreationControllerClient.prototype.executeBatch = function (f) {
        return this.execute('batch').then(f).
          catch(function (e) {
            console.log('got an error in batched function processing', e);
            throw e;
            // in $q it's better to `return $q.reject(e)` here
          }).then(function () {
            this.execute('run-batch');
          }.bind(this)).catch(function () {
            // handle errors in processing or in error.
          });
      };

      /**
       *
       * Creates a invalidation/local cache at a given DMR address a and a cache configuration structure
       *
       * @param cache cache configuration
       * @param address DMR address of the cache
       * @param cacheType cache type to create
       * @param callback to execute at the end of create operation
       */
      CacheCreationControllerClient.prototype.createInvalidationOrLocalCacheConfigurationTemplate = function (configuration, address, cacheType) {
        return this.createConfigurationTemplateBare(configuration, address, cacheType);
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
       *  queue-size  INT  In ASYNC mode, this attribute can be used to trigger flushing of the queue when it reaches a specific threshold.
       *  async-marshalling  BOOLEAN  If enabled, this will cause marshalling of entries to be performed asynchronously.
       *  queue-flush-interval  LONG  In ASYNC mode, this attribute controls how often the asynchronous thread used to flush the
       * replication queue runs. This should be a positive integer which represents thread wakeup time in milliseconds.
       *
       *  owners  INT  Number of cluster-wide replicas for each cache entry.
       *
       *
       */
      CacheCreationControllerClient.prototype.createCacheConfigurationNode = function (address, prop) {
        // remove DMR attributes we added when we loaded the model
        return this.executeAddOperation(address, prop, ['name','type','template']);
      };

      CacheCreationControllerClient.prototype.removeCacheConfigurationNode = function (cacheType, templateName) {
        var dmrConfigurationsAddress = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan',
          'cache-container', 'clustered', 'configurations', 'CONFIGURATIONS', cacheType + '-configuration', templateName];
        // remove DMR attributes we added when we loaded the model
        var op = {
          'operation': 'remove',
          'address': dmrConfigurationsAddress
        };
        return this.execute(op);
      };

      CacheCreationControllerClient.prototype.addNode = function (address, prop, excludeAttributeList, forceOp) {
        //peek the last element of the address array but do not pop it
        var modelNode = address.slice(-1).pop();
        if (utils.isNotNullOrUndefined(prop) && prop.hasOwnProperty(modelNode)) {
          return this.executeAddOperation(address, prop[modelNode], excludeAttributeList, forceOp);
        } else {
          return this.emptyPromise();
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

      CacheCreationControllerClient.prototype.createAddOperation = function (address, prop, excludeAttributeList) {
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
            if (utils.isNotNullOrUndefined(propValue) && !utils.isObject(propValue)) {
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
        //and remove attributes from exclusion list (if any)
        angular.forEach(excludeAttributeList, function (attribute){
          delete op[attribute];
        });
        return op;
      };
      return new CacheCreationControllerClient(window.location.origin);
    }
  ]);
