'use strict';

angular.module('managementConsole.api')
    .factory('cacheCreateController', [
    '$http',
    '$q',
    'modelController',
    function ($http, $q, modelController) {

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
                var deferred = $q.defer();
                var http = new XMLHttpRequest();
                var username = modelController.credentials.username;
                var password = modelController.credentials.password;
                http.withCredentials = true;
                http.open('POST', this.url, true, username, password);
                http.setRequestHeader('Content-type', 'application/json');
                http.setRequestHeader('Accept', 'application/json');
                http.onreadystatechange = function () {
                    if (http.readyState === 4 && http.status === 200) {
                        var response = JSON.parse(http.responseText);
                        if (response.outcome === 'success') {
                            deferred.resolve(response.result);
                        } else {
                            deferred.reject();
                        }
                    }
                };
                //console.log(JSON.stringify(op));
                http.send(JSON.stringify(op));
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
            CacheCreationControllerClient.prototype.createCache = function (address, cacheConfiguration, callback) {
              if (cacheConfiguration.type === 'distributed-cache' || cacheConfiguration.type === 'replicated-cache') {
                this.createReplicatedOrDistributedCache(cacheConfiguration, address, cacheConfiguration.type, callback);
              } else if (cacheConfiguration.type === 'invalidation-cache' || cacheConfiguration.type === 'local-cache') {
                this.createInvalidationOrLocalCache(cacheConfiguration, address, cacheConfiguration.type, callback);
              }
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
            CacheCreationControllerClient.prototype.createReplicatedOrDistributedCache = function (cache, address, cacheType, callback) {
              var promise = null;
              if (cacheType === 'distributed-cache') {
                promise = this.createDistributedCache(address, cache.data);
              } else if (cacheType === 'replicated-cache') {
                promise = this.createReplicatedCache(address, cache.data);
              }
              promise.then(function () {
                this.createLockingNode(address.concat('locking', 'LOCKING'), cache.data.locking.LOCKING);
                this.createEvictionNode(address.concat('eviction', 'EVICTION'), cache.data.eviction.EVICTION);
                this.createExpirationNode(address.concat('expiration', 'EXPIRATION'), cache.data.expiration.EXPIRATION);
                this.createCompatibilityNode(address.concat('compatibility', 'COMPATIBILITY'), cache.data.compatibility.COMPATIBILITY);
                this.createTransactionNode(address.concat('transaction', 'TRANSACTION'), cache.data.transaction.TRANSACTION);
                this.createStateTransferNode(address.concat('state-transfer', 'STATE_TRANSFER'), cache.data['state-transfer'].STATE_TRANSFER);
                this.createFileStoreNode(address.concat('file-store', 'FILE_STORE'), cache.data['file-store'].FILE_STORE);
                this.createJDBCStoreNode(address.concat('string-keyed-jdbc-store', 'STRING_KEYED_JDBC_STORE'),
                  cache.data['string-keyed-jdbc-store'].STRING_KEYED_JDBC_STORE);
              }.bind(this)).then(function () {
                callback();
              })
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
            CacheCreationControllerClient.prototype.createInvalidationOrLocalCache = function (cache, address, cacheType, callback) {
              var promise = null;
              if (cacheType === 'invalidation-cache') {
                promise = this.createInvalidationCache(address, cache.data);
              } else if (cacheType === 'local-cache') {
                promise = this.createLocalCache(address, cache.data);
              }
              promise.then(function () {
                this.createLockingNode(address.concat('locking', 'LOCKING'), cache.data.locking.LOCKING);
                this.createEvictionNode(address.concat('eviction', 'EVICTION'), cache.data.eviction.EVICTION);
                this.createExpirationNode(address.concat('expiration', 'EXPIRATION'), cache.data.expiration.EXPIRATION);
                this.createCompatibilityNode(address.concat('compatibility', 'COMPATIBILITY'), cache.data.compatibility.COMPATIBILITY);
                this.createTransactionNode(address.concat('transaction', 'TRANSACTION'), cache.data.transaction.TRANSACTION);
                this.createFileStoreNode(address.concat('file-store', 'FILE_STORE'), cache.data['file-store'].FILE_STORE);
                this.createJDBCStoreNode(address.concat('string-keyed-jdbc-store', 'STRING_KEYED_JDBC_STORE'),
                  cache.data['string-keyed-jdbc-store'].STRING_KEYED_JDBC_STORE);
              }.bind(this)).then(function () {
                callback();
              })
            };


            /**
             * Creates new distributed cache with given parameters
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             * mode STRING	Sets the clustered cache mode, ASYNC for asynchronous operation, or SYNC for synchronous operation.
             *
             *  module	STRING	The module whose class loader should be used when building this cache's configuration
             *  remote_cache	STRING	The name of the remote cache that backups data here
             *  segments	INT	Controls the number of hash space segments which is the granularity for key distribution
             * in the cluster. Value must be strictly positive.
             *  indexing STRING	If enabled, entries will be indexed when they are added to the cache.
             * Indexes will be updated as entries change or are removed.
             *
             *  auto-config	BOOLEAN	If enabled, will configure indexing automatically based on cache type
             *  statistics	BOOLEAN	If enabled, statistics will be collected for this cache
             *  remote-timeout	LONG	In SYNC mode, the timeout (in ms) used to wait for an acknowledgment when making
             * a remote call, after which the call is aborted and an exception is thrown.
             *
             *  capacity-factor	DOUBLE	Controls the proportion of entries that will reside on the local node, compared
             * to the other nodes in the cluster. Value must be positive. This element is only used in 'distributed' cache instances.
             *
             *  batching	BOOLEAN	If enabled, the invocation batching API will be made available for this cache.
             *  start	STRING	The cache start mode, which can be EAGER (immediate start) or LAZY (on-demand start).
             *  l1-lifespan	LONG	Maximum lifespan of an entry placed in the L1 cache. This element configures the L1 cache
             * behavior in 'distributed' caches instances. In any other cache modes, this element is ignored.
             *
             *  remote-site	STRING	The name of the remote site containing the cache that backups data here.
             *  jndi-name	STRING	The jndi-name to which to bind this cache instance.
             *  queue-size	INT	In ASYNC mode, this attribute can be used to trigger flushing of the queue when it reaches a specific threshold.
             *  async-marshalling	BOOLEAN	If enabled, this will cause marshalling of entries to be performed asynchronously.
             *  queue-flush-interval	LONG	In ASYNC mode, this attribute controls how often the asynchronous thread used to flush the
             * replication queue runs. This should be a positive integer which represents thread wakeup time in milliseconds.
             *
             *  owners	INT	Number of cluster-wide replicas for each cache entry.
             *
             *
             */
            CacheCreationControllerClient.prototype.createDistributedCache = function (address, prop) {


              var op = {
                'operation': 'add',
                'mode': prop.mode,
                'module': prop.module,
                'remote-cache': prop['remote-cache'],
                'segments': prop.segments,
                'indexing': prop.indexing,
                'auto-config': prop['auto-config'],
                'statistics': prop.statistics,
                'remote-timeout': prop['remote-timeout'],
                'capacity-factor': prop['capacity-factor'],
                'batching': prop.batching,
                'start': prop.start,
                'l1-lifespan': prop['l1-lifespan'],
                'remote-site': prop['remote-site'],
                'jndi-name': prop['jndi-name'],
                'queue-size': prop['queue-size'],
                'queue-flush-interval': prop['queue-flush-interval'],
                'owners': prop['owners'],
                'address': address
              };
              return this.execute(op);
            };


            /**
             * Creates new invalidation cache with given parameters
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             * mode STRING	Sets the clustered cache mode, ASYNC for asynchronous operation, or SYNC for synchronous operation.
             *
             * module	STRING	The module whose class loader should be used when building this cache's configuration
             * remote_cache	STRING	The name of the remote cache that backups data here
             * indexing STRING	If enabled, entries will be indexed when they are added to the cache.
             * Indexes will be updated as entries change or are removed.
             *
             * auto-config	BOOLEAN	If enabled, will configure indexing automatically based on cache type
             * statistics	BOOLEAN	If enabled, statistics will be collected for this cache
             * remote-timeout	LONG	In SYNC mode, the timeout (in ms) used to wait for an acknowledgment when making
             * a remote call, after which the call is aborted and an exception is thrown.
             *
             * batching	BOOLEAN	If enabled, the invocation batching API will be made available for this cache.
             * start	STRING	The cache start mode, which can be EAGER (immediate start) or LAZY (on-demand start).
             * remote-site	STRING	The name of the remote site containing the cache that backups data here.
             * jndi-name	STRING	The jndi-name to which to bind this cache instance.
             * queue-size	INT	In ASYNC mode, this attribute can be used to trigger flushing of the queue when it reaches a specific threshold.
             * async-marshalling	BOOLEAN	If enabled, this will cause marshalling of entries to be performed asynchronously.
             * queue-flush-interval	LONG	In ASYNC mode, this attribute controls how often the asynchronous thread used to flush the
             * replication queue runs. This should be a positive integer which represents thread wakeup time in milliseconds.
             *
             */

            CacheCreationControllerClient.prototype.createInvalidationCache = function (address, prop) {
              var op = {
                'operation': 'add',
                'mode': prop.mode,
                'module': prop['module'],
                'remote-cache': prop['remote-cache'],
                'indexing': prop.indexing,
                'auto-config': prop['auto-config'],
                'statistics': prop.statistics,
                'remote-timeout': prop['remote-timeout'],
                'batching': prop.batching,
                'start': prop.start,
                'remote-site': prop['remote-site'],
                'jndi-name': prop['jndi-name'],
                'queue-size': prop['queue-size'],
                'queue-flush-interval': prop['queue-flush-interval'],
                'address': address
              };
              return this.execute(op);
            };

            /**
             * Creates new local cache with given parameters
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             * mode STRING	Sets the clustered cache mode, ASYNC for asynchronous operation, or SYNC for synchronous operation.
             *
             * module	STRING	The module whose class loader should be used when building this cache's configuration
             * remote_cache	STRING	The name of the remote cache that backups data here
             * indexing STRING	If enabled, entries will be indexed when they are added to the cache.
             * Indexes will be updated as entries change or are removed.
             *
             * auto-config	BOOLEAN	If enabled, will configure indexing automatically based on cache type
             * statistics	BOOLEAN	If enabled, statistics will be collected for this cache
             * a remote call, after which the call is aborted and an exception is thrown.
             *
             * batching	BOOLEAN	If enabled, the invocation batching API will be made available for this cache.
             * start	STRING	The cache start mode, which can be EAGER (immediate start) or LAZY (on-demand start).
             * remote-site	STRING	The name of the remote site containing the cache that backups data here.
             * jndi-name	STRING	The jndi-name to which to bind this cache instance.
             *
             */
            CacheCreationControllerClient.prototype.createLocalCache = function (address, prop) {
              var op = {
                'operation': 'add',
                'module': prop.module,
                'remote-cache': prop['remote-cache'],
                'indexing': prop.indexing,
                'auto-config': prop['auto-config'],
                'statistics': prop.statistics,
                'batching': prop.batching,
                'start': prop.start,
                'remote-site': prop['remote-site'],
                'jndi-name': prop['jndi-name'],
                'address': address
              };
              return this.execute(op);
            };


            /**
             * Creates new replicated cache with given parameters
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             * mode STRING	Sets the clustered cache mode, ASYNC for asynchronous operation, or SYNC for synchronous operation.
             *
             * module	STRING	The module whose class loader should be used when building this cache's configuration
             * remote_cache	STRING	The name of the remote cache that backups data here
             * indexing STRING	If enabled, entries will be indexed when they are added to the cache.
             * Indexes will be updated as entries change or are removed.
             *
             * auto-config	BOOLEAN	If enabled, will configure indexing automatically based on cache type
             * statistics	BOOLEAN	If enabled, statistics will be collected for this cache
             * remote-timeout	LONG	In SYNC mode, the timeout (in ms) used to wait for an acknowledgment when making
             * a remote call, after which the call is aborted and an exception is thrown.
             *
             * batching	BOOLEAN	If enabled, the invocation batching API will be made available for this cache.
             * start	STRING	The cache start mode, which can be EAGER (immediate start) or LAZY (on-demand start).
             * remote-site	STRING	The name of the remote site containing the cache that backups data here.
             * jndi-name	STRING	The jndi-name to which to bind this cache instance.
             * queue-size	INT	In ASYNC mode, this attribute can be used to trigger flushing of the queue when it reaches a specific threshold.
             * async-marshalling	BOOLEAN	If enabled, this will cause marshalling of entries to be performed asynchronously.
             * queue-flush-interval	LONG	In ASYNC mode, this attribute controls how often the asynchronous thread used to flush the
             * replication queue runs. This should be a positive integer which represents thread wakeup time in milliseconds.
             *
             */
            CacheCreationControllerClient.prototype.createReplicatedCache = function (address, prop) {
              var op = {
                'operation': 'add',
                'mode': prop.mode,
                'module': prop.module,
                'remote-cache': prop['remote-cache'],
                'indexing': prop.indexing,
                'auto-config': prop['auto-config'],
                'statistics': prop.statistics,
                'remote-timeout': prop['remote-timeout'],
                'batching': prop.batching,
                'start': prop.start,
                'remote-site': prop['remote-site'],
                'jndi-name': prop['jndi-name'],
                'queue-size': prop['queue-size'],
                'queue-flush-interval': prop['queue-flush-interval'],
                'address': address
              };
              return this.execute(op);
            };

            /**
             * Creates new backup cache child node with given parameters
             *
             * Parameter @param prop has the following properties:
             *
             *
             * @param address
             *  enabled	BOOLEAN	If enabled, the cache will be backed-up to the remote site.
             *  min-wait	INT	The minimal number of millis to wait before taking this site offline,
             * even in the case 'after-failures' is reached.
             *  after-failures	INT	The number of failed request operations after which this site should be taken offline.
             *  strategy	STRING	The strategy to use for the cache backup.
             *  failure-policy	STRING	The failure policy to use for the cache backup.
             *  timeout	STRING	The time to wait for responses from the backup site.
             *
             *
             */
            CacheCreationControllerClient.prototype.createBackupCacheNode = function (address, prop) {
              var op = {
                'operation': 'add',
                'enabled': prop.enabled,
                'min-wait': prop['min-wait'],
                'after-failures': prop['after-failures'],
                'strategy': prop.strategy,
                'failure-policy': prop['failure-policy'],
                'timeout': prop.timeout,
                'address': address
              };
              return this.execute(op);
            };


            /**
             * Creates new write-behind configuration element
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             *  modification-queue-size	INT	Maximum number of entries in the asynchronous queue.
             * When the queue is full, the store becomes write-through until it can accept new entries.
             *
             *  flush-lock-timeout	LONG	Timeout to acquire the lock which guards the state to be
             * flushed to the cache store periodically.
             *
             *  thread-pool-size	INT	Size of the thread pool whose threads are responsible for applying the modifications to the cache store.
             *
             *  shutdown-timeout	LONG	Timeout in milliseconds to stop the cache store.
             *
             */
            CacheCreationControllerClient.prototype.createWriteBehindNode = function (address, prop) {
              var op = {
                'operation': 'add',
                'modification-queue-size': prop['modification-queue-size'],
                'flush-lock-timeout': prop['flush-lock-timeout'],
                'thread-pool-size': prop['thread-pool-size'],
                'shutdown-timeout': prop['shutdown-timeout'],
                'address': address
              };
              return this.execute(op);
            };

            /**
             * Creates new cluster loader configuration element
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             *  shared	BOOLEAN	This setting should be set to true when multiple cache instances share the same
             * cache store (e.g., multiple nodes in a cluster using a JDBC-based CacheStore pointing to the same, shared
             * database.) Setting this to true avoids multiple cache instances writing the same modification multiple times.
             * If enabled, only the node where the modification originated will write to the cache store. If disabled, each
             * individual cache reacts to a potential remote update by storing the data to the cache store.
             *
             *  preload	BOOLEAN	If true, when the cache starts, data stored in the cache store will be pre-loaded into memory.
             * This is particularly useful when data in the cache store will be needed immediately after startup and you
             * want to avoid cache operations being delayed as a result of loading this data lazily. Can be used to
             * provide a 'warm-cache' on startup, however there is a performance penalty as startup time is affected by
             * this process.
             *
             *   remote-timeout	LONG	In SYNC mode, the timeout (in ms) used to wait for an acknowledgment when making
             * a remote call, after which the call is aborted and an exception is thrown.
             *
             */
            CacheCreationControllerClient.prototype.createClusterLoaderNode = function (address, prop) {
              var op = {
                'operation': 'add',
                'shared': prop.shared,
                'preload': prop.preload,
                'remote-timeout' : prop['remote-timeout'],
                'address': address
              };
              return this.execute(op);
            };

            /**
             * Creates new compatibility configuration element
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             * enabled	BOOLEAN	Enables compatibility mode for the cache.
             * marshaller	STRING	The marshaller to use for compatibility mode.
             *
             */
            CacheCreationControllerClient.prototype.createCompatibilityNode = function (address, prop) {
              var op = {
                'operation': 'add',
                'enabled': prop.enabled,
                'marshaller': prop.marshaller,
                'address': address
              };
              return this.execute(op);
            };

            /**
             * Creates new eviction configuration element
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             * strategy	STRING	Sets the cache eviction strategy. Available options are 'UNORDERED',
             * 'FIFO', 'LRU', 'LIRS' and 'NONE' (to disable eviction).
             *
             * max-entries	LONG	Maximum number of entries in a cache instance. If selected value is not a power
             * of two the actual value will default to the least power of two larger than selected value. -1 means no limit.
             *
             *
             */
            CacheCreationControllerClient.prototype.createEvictionNode = function (address, prop) {
              var op = {
                'operation': 'add',
                'strategy': prop.strategy,
                'max-entries': prop['max-entries'],
                'address': address
              };
              return this.execute(op);
            };

            /**
             * Creates new expiration configuration element
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             * lifespan	LONG	Maximum lifespan of a cache entry, after which the entry is expired cluster-wide,
             * in milliseconds. -1 means the entries never expire.
             *
             * max-idle	LONG	Maximum idle time a cache entry will be maintained in the cache, in milliseconds.
             * If the idle time is exceeded, the entry will be expired cluster-wide. -1 means the entries never expire.
             *
             * interval	LONG	Interval (in milliseconds) between subsequent runs to purge expired entries from
             * memory and any cache stores. If you wish to disable the periodic eviction process altogether, set wakeupInterval to -1.
             *
             *
             */
            CacheCreationControllerClient.prototype.createExpirationNode = function (address, prop ) {
              var op = {
                'operation': 'add',
                'lifespan': prop.lifespan,
                'max-idle': prop['max-idle'],
                'interval': prop.interval,
                'address': address
              };
              return this.execute(op);
            };


            /**
             * Creates new file store configuration element
             *
             *
             * @param address
             *
             * Parameter @param prop has the following properties:
             *
             *  shared	BOOLEAN	This setting should be set to true when multiple cache instances share the same
             * cache store (e.g., multiple nodes in a cluster using a JDBC-based CacheStore pointing to the same, shared
             * database.) Setting this to true avoids multiple cache instances writing the same modification multiple
             * times. If enabled, only the node where the modification originated will write to the cache store. If
             * disabled, each individual cache reacts to a potential remote update by storing the data to the cache store.
             *
             *  preload	BOOLEAN	If true, when the cache starts, data stored in the cache store will be pre-loaded
             * into memory. This is particularly useful when data in the cache store will be needed immediately after
             * startup and you want to avoid cache operations being delayed as a result of loading this data lazily. Can
             * be used to provide a 'warm-cache' on startup, however there is a performance penalty as startup time is
             * affected by this process.
             *
             *  passivation	BOOLEAN	If true, data is only written to the cache store when it is evicted from memory,
             * a phenomenon known as 'passivation'. Next time the data is requested, it will be 'activated' which means
             * that data will be brought back to memory and removed from the persistent store. f false, the cache store
             * contains a copy of the contents in memory, so writes to cache result in cache store writes. This essentially
             * gives you a 'write-through' configuration.
             *
             *  fetch-state	BOOLEAN	If true, fetch persistent state when joining a cluster. If multiple cache stores
             * are chained, only one of them can have this property enabled.
             *
             *  purge	BOOLEAN	If true, purges this cache store when it starts up.
             *
             *  read-only	BOOLEAN	If true, the cache store will only be used to load entries. Any modifications made
             * to the caches will not be applied to the store.
             *
             *  singleton	BOOLEAN	If true, the singleton store cache store is enabled. SingletonStore is a delegating
             * cache store used for situations when only one instance in a cluster should interact with the underlying store.
             *
             *  max-entries	INT	The maximum number of entries.
             *
             *  relative-to	STRING	The path this is relative to
             *
             *  path	STRING	An absolute path if relativeTo is null, otherwise the relative path to relativeTo
             *
             *
             */
            CacheCreationControllerClient.prototype.createFileStoreNode = function (address, prop) {
              var op = {
                'operation': 'add',
                'shared': prop.shared,
                'preload': prop.preload,
                'passivation': prop.passivation,
                'fetch-state': prop['fetch-state'],
                'purge' : prop.purge,
                'read-only' : prop['read-only'],
                'singleton' : prop.singleton,
                'max-entries' : prop['max-entries'],
                'relative-to' : prop['relative-to'],
                'path' : prop.path,
                'address': address
              };
              return this.execute(op);
            };



          /**
           * Creates new leveldb store configuration element
           *
           *
           * @param address
           *
           * Parameter @param prop has the following properties:
           *
           *  shared	BOOLEAN	This setting should be set to true when multiple cache instances share the same
           * cache store (e.g., multiple nodes in a cluster using a JDBC-based CacheStore pointing to the same, shared
           * database.) Setting this to true avoids multiple cache instances writing the same modification multiple
           * times. If enabled, only the node where the modification originated will write to the cache store. If
           * disabled, each individual cache reacts to a potential remote update by storing the data to the cache store.
           *
           *  preload	BOOLEAN	If true, when the cache starts, data stored in the cache store will be pre-loaded
           * into memory. This is particularly useful when data in the cache store will be needed immediately after
           * startup and you want to avoid cache operations being delayed as a result of loading this data lazily. Can
           * be used to provide a 'warm-cache' on startup, however there is a performance penalty as startup time is
           * affected by this process.
           *
           *  passivation	BOOLEAN	If true, data is only written to the cache store when it is evicted from memory,
           * a phenomenon known as 'passivation'. Next time the data is requested, it will be 'activated' which means
           * that data will be brought back to memory and removed from the persistent store. f false, the cache store
           * contains a copy of the contents in memory, so writes to cache result in cache store writes. This essentially
           * gives you a 'write-through' configuration.
           *
           *  fetch-state	BOOLEAN	If true, fetch persistent state when joining a cluster. If multiple cache stores
           * are chained, only one of them can have this property enabled.
           *
           *  purge	BOOLEAN	If true, purges this cache store when it starts up.
           *
           *  read-only	BOOLEAN	If true, the cache store will only be used to load entries. Any modifications made
           * to the caches will not be applied to the store.
           *
           *  singleton	BOOLEAN	If true, the singleton store cache store is enabled. SingletonStore is a delegating
           * cache store used for situations when only one instance in a cluster should interact with the underlying store.
           *
           *  path	STRING	An absolute path if relativeTo is null, otherwise the relative path to relativeTo
           *
           *  block-size	INT	The cache store block size
           *
           *  cache-size	LONG	Cache size for the cache store
           *
           *  clear-threshold	INT	Cache store cache clear threshold
           *
           *
           */
          CacheCreationControllerClient.prototype.createLevelDBStoreNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'shared': prop.shared,
              'preload': prop.preload,
              'passivation': prop.passivation,
              'fetch-state': prop['fetch-state'],
              'purge' : prop.purge,
              'read-only' : prop['read-only'],
              'singleton' : prop.singleton,
              'path' : prop.path,
              'block-size': prop['block-size'],
              'cache-size': prop['cache-size'],
              'clear-threshold' : prop['clear-threshold'],
              'address': address
            };
            return this.execute(op);
          };

          /**
           * Creates new loader store configuration element
           *
           *
           * @param address
           *
           * Parameter @param prop has the following properties:
           *
           * shared	BOOLEAN	This setting should be set to true when multiple cache instances share the same
           * cache store (e.g., multiple nodes in a cluster using a JDBC-based CacheStore pointing to the same, shared
           * database.) Setting this to true avoids multiple cache instances writing the same modification multiple
           * times. If enabled, only the node where the modification originated will write to the cache store. If
           * disabled, each individual cache reacts to a potential remote update by storing the data to the cache store.
           *
           * preload	BOOLEAN	If true, when the cache starts, data stored in the cache store will be pre-loaded
           * into memory. This is particularly useful when data in the cache store will be needed immediately after
           * startup and you want to avoid cache operations being delayed as a result of loading this data lazily. Can
           * be used to provide a 'warm-cache' on startup, however there is a performance penalty as startup time is
           * affected by this process.
           *
           * class STRING	The custom loader implementation class to use for this cache loader.
           *
           *
           */
          CacheCreationControllerClient.prototype.createLoaderStoreChildNode = function (address, prop ) {
            var op = {
              'operation': 'add',
              'shared': prop.shared,
              'preload': prop.preload,
              'class': prop.class,
              'address': address
            };
            return this.execute(op);
          };

          /**
           * Creates new locking configuration element
           *
           *
           * @param address
           *
           * Parameter @param prop has the following properties:
           *
           * acquire-timeout	LONG	Maximum time to attempt a particular lock acquisition.
           *
           * isolation	STRING	Sets the cache locking isolation level.
           *
           * striping	BOOLEAN	If true, a pool of shared locks is maintained for all entries that need to be locked.
           * Otherwise, a lock is created per entry in the cache. Lock striping helps control memory footprint but may
           * reduce concurrency in the system.
           *
           * concurrency-level	INT	The estimated number of concurrently updating threads which this cache can
           * support. May return null if the cache is not started.
           *
           *
           */
          CacheCreationControllerClient.prototype.createLockingNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'acquire-timeout': prop['acquire-timeout'],
              'isolation': prop.isolation,
              'striping': prop.striping,
              'concurrency-level': prop['concurrency-level'],
              'address': address
            };
            return this.execute(op);
          };

          /**
           * Creates new write-behind store configuration element
           *
           *
           * @param address
           *
           *  modification-queue-size	INT	Maximum number of entries in the asynchronous queue. When the queue is
           * full, the store becomes write-through until it can accept new entries.
           *
           *  flush-lock-timeout	LONG	Timeout to acquire the lock which guards the state to be flushed to
           * the cache store periodically.
           *
           *  thread-pool-size	INT	Size of the thread pool whose threads are responsible for applying the
           * modifications to the cache store.
           *
           *  shutdown-timeout	LONG	Timeout in milliseconds to stop the cache store.
           *
           *
           */
          CacheCreationControllerClient.prototype.createWriteBehindStoreNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'modification-queue-size': prop['modification-queue-size'],
              'flush-lock-timeout': prop['flush-lock-timeout'],
              'thread-pool-size': prop['thread-pool-size'],
              'shutdown-timeout': prop['shutdown-timeout'],
              'address': address
            };
            return this.execute(op);
          };

          /**
           * Creates new partition handling configuration for distribution and replicated caches
           *
           *
           * @param address
           *
           * @param enabled	BOOLEAN	Configures the way this cache reacts to node crashes and split brains
           *
           *
           */
          CacheCreationControllerClient.prototype.createPartitionHandlingNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'enabled': prop.enabled,
              'address': address
            };
            return this.execute(op);
          };


          /**
           * Creates new remote store configuration element
           *
           *
           * @param address
           *
           * Parameter @param prop has the following properties:
           *
           *  shared	BOOLEAN	This setting should be set to true when multiple cache instances share the same
           * cache store (e.g., multiple nodes in a cluster using a JDBC-based CacheStore pointing to the same, shared
           * database.) Setting this to true avoids multiple cache instances writing the same modification multiple
           * times. If enabled, only the node where the modification originated will write to the cache store. If
           * disabled, each individual cache reacts to a potential remote update by storing the data to the cache store.
           *
           *  preload	BOOLEAN	If true, when the cache starts, data stored in the cache store will be pre-loaded
           * into memory. This is particularly useful when data in the cache store will be needed immediately after
           * startup and you want to avoid cache operations being delayed as a result of loading this data lazily. Can
           * be used to provide a 'warm-cache' on startup, however there is a performance penalty as startup time is
           * affected by this process.
           *
           *  passivation	BOOLEAN	If true, data is only written to the cache store when it is evicted from memory,
           * a phenomenon known as 'passivation'. Next time the data is requested, it will be 'activated' which means
           * that data will be brought back to memory and removed from the persistent store. f false, the cache store
           * contains a copy of the contents in memory, so writes to cache result in cache store writes. This essentially
           * gives you a 'write-through' configuration.
           *
           *  fetch-state	BOOLEAN	If true, fetch persistent state when joining a cluster. If multiple cache stores
           * are chained, only one of them can have this property enabled.
           *
           *  purge	BOOLEAN	If true, purges this cache store when it starts up.
           *
           *  read-only	BOOLEAN	If true, the cache store will only be used to load entries. Any modifications made
           * to the caches will not be applied to the store.
           *
           *  singleton	BOOLEAN	If true, the singleton store cache store is enabled. SingletonStore is a delegating
           * cache store used for situations when only one instance in a cluster should interact with the underlying store.
           *
           *  cache	STRING	The name of the remote cache to use for this remote store.
           *
           *  hotrod-wrapping	BOOLEAN	Enables wrapping of entries into a form usable by a HotRod server
           *
           *  raw-values	BOOLEAN	Stores information on the remote cache in a raw format suitable for interoperability
           * with other RemoteCacheManagers
           *
           *  tcp-no-delay	BOOLEAN	A TCP_NODELAY value for remote cache communication.
           *
           *  socket-timeout	LONG	A socket timeout for remote cache communication.
           *
           *  remote-servers	LIST	A list of remote servers for this cache store.
           *
           *
           */
          CacheCreationControllerClient.prototype.createRemoteStoreNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'shared': prop.shared,
              'preload': prop.preload,
              'passivation': prop.passivation,
              'fetch-state': prop['fetch-state'],
              'purge' : prop.purge,
              'read-only' : prop['read-only'],
              'singleton' : prop.singleton,
              'cache' : prop.cache,
              'hotrod-wrapping' : prop['hotrod-wrapping'],
              'raw-values' :prop['raw-values'],
              'tcp-no-delay' : prop['tcp-no-delay'],
              'socket-timeout' : prop['socket-timeout'],
              'remote-servers': prop['remote-servers'],
              'address': address
            };
            return this.execute(op);
          };


          /**
           * Creates new REST cache store configuration element
           *
           *
           * @param address
           *
           *
           * Parameter @param prop has the following properties:
           *
           *  shared	BOOLEAN	This setting should be set to true when multiple cache instances share the same
           * cache store (e.g., multiple nodes in a cluster using a JDBC-based CacheStore pointing to the same, shared
           * database.) Setting this to true avoids multiple cache instances writing the same modification multiple
           * times. If enabled, only the node where the modification originated will write to the cache store. If
           * disabled, each individual cache reacts to a potential remote update by storing the data to the cache store.
           *
           *  preload	BOOLEAN	If true, when the cache starts, data stored in the cache store will be pre-loaded
           * into memory. This is particularly useful when data in the cache store will be needed immediately after
           * startup and you want to avoid cache operations being delayed as a result of loading this data lazily. Can
           * be used to provide a 'warm-cache' on startup, however there is a performance penalty as startup time is
           * affected by this process.
           *
           *  passivation	BOOLEAN	If true, data is only written to the cache store when it is evicted from memory,
           * a phenomenon known as 'passivation'. Next time the data is requested, it will be 'activated' which means
           * that data will be brought back to memory and removed from the persistent store. f false, the cache store
           * contains a copy of the contents in memory, so writes to cache result in cache store writes. This essentially
           * gives you a 'write-through' configuration.
           *
           *  fetch-state	BOOLEAN	If true, fetch persistent state when joining a cluster. If multiple cache stores
           * are chained, only one of them can have this property enabled.
           *
           *  purge	BOOLEAN	If true, purges this cache store when it starts up.
           *
           *  read-only	BOOLEAN	If true, the cache store will only be used to load entries. Any modifications made
           * to the caches will not be applied to the store.
           *
           *  singleton	BOOLEAN	If true, the singleton store cache store is enabled. SingletonStore is a delegating
           * cache store used for situations when only one instance in a cluster should interact with the underlying store.
           *
           *  path STRING	The path portion of the URI of the remote REST endpoint.
           *
           *  append-cache-name-to-path	BOOLEAN	Whether to append the name of the cache to the path.
           *
           *  connection-pool	OBJECT	The configuration of the HTTP connection pool
           * with other RemoteCacheManagers
           *
           *  remote-servers	LIST	A list of remote servers for this cache store.
           *
           *
           */
          CacheCreationControllerClient.prototype.createRestStoreNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'shared': prop.shared,
              'preload': prop.preload,
              'passivation': prop.passivation,
              'fetch-state': prop['fetch-state'],
              'purge' : prop.purge,
              'read-only' : prop['read-only'],
              'singleton' : singleton,
              'path' : path,
              'append-cache-name-to-path' : prop['append-cache-name-to-path'],
              'connection-pool' : prop['connection-pool'],
              'remote-servers' : prop['remote-servers'],
              'address': address
            };
            return this.execute(op);
          };

          /**
           * Creates new state transfer configuration element
           *
           *
           * @param address
           *
           * Parameter @param prop has the following properties:
           *
           *  enabled	BOOLEAN	If enabled, this will cause the cache to ask neighboring caches for state when it
           * starts up, so the cache starts 'warm', although it will impact startup time.
           *
           *  await-initial-transfer	BOOLEAN	Wait for the initial state transfer to complete before making a cache available.
           *
           *  chunk-size	INT	The size, in bytes, in which to batch the transfer of cache entries.
           *
           *  timeout	LONG	The maximum amount of time (ms) to wait for state from neighboring caches, before
           * throwing an exception and aborting startup.
           *
           */
          CacheCreationControllerClient.prototype.createStateTransferNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'enabled': prop.enabled,
              'await-initial-transfer': prop['await-initial-transfer'],
              'chunk-size': prop['chunk-size'],
              'timeout': prop.timeout,
              'address': address
            };
            return this.execute(op);
          };


          /**
           * Creates new cache store configuration element
           *
           *
           * @param address
           *
           * Parameter @param prop has the following properties:
           *
           *  shared	BOOLEAN	This setting should be set to true when multiple cache instances share the same
           * cache store (e.g., multiple nodes in a cluster using a JDBC-based CacheStore pointing to the same, shared
           * database.) Setting this to true avoids multiple cache instances writing the same modification multiple
           * times. If enabled, only the node where the modification originated will write to the cache store. If
           * disabled, each individual cache reacts to a potential remote update by storing the data to the cache store.
           *
           *  preload	BOOLEAN	If true, when the cache starts, data stored in the cache store will be pre-loaded
           * into memory. This is particularly useful when data in the cache store will be needed immediately after
           * startup and you want to avoid cache operations being delayed as a result of loading this data lazily. Can
           * be used to provide a 'warm-cache' on startup, however there is a performance penalty as startup time is
           * affected by this process.
           *
           *  passivation	BOOLEAN	If true, data is only written to the cache store when it is evicted from memory,
           * a phenomenon known as 'passivation'. Next time the data is requested, it will be 'activated' which means
           * that data will be brought back to memory and removed from the persistent store. f false, the cache store
           * contains a copy of the contents in memory, so writes to cache result in cache store writes. This essentially
           * gives you a 'write-through' configuration.
           *
           *  fetch-state	BOOLEAN	If true, fetch persistent state when joining a cluster. If multiple cache stores
           * are chained, only one of them can have this property enabled.
           *
           *  class	BOOLEAN	If true, fetch persistent state when joining a cluster. If multiple cache stores
           * are chained, only one of them can have this property enabled.
           *
           *  purge	BOOLEAN	If true, purges this cache store when it starts up.
           *
           *  read-only	BOOLEAN	If true, the cache store will only be used to load entries. Any modifications made
           * to the caches will not be applied to the store.
           *
           *  singleton	BOOLEAN	If true, the singleton store cache store is enabled. SingletonStore is a delegating
           * cache store used for situations when only one instance in a cluster should interact with the underlying store.
           *
           *
           */
          CacheCreationControllerClient.prototype.createCacheStoreNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'shared': prop.shared,
              'preload': prop.preload,
              'passivation': prop.passivation,
              'fetch-state': prop['fetch-state'],
              'purge' : prop.purge,
              'read-only' : prop['read-only'],
              'singleton' : prop.singleton,
              'path' : prop.path,
              'class' : prop.class,
              'address': address
            };
            return this.execute(op);
          };


          /**
           * Creates new string keyed cache JDBC store configuration element
           *
           *
           * @param address
           *
           * Parameter @param prop has the following properties:
           *
           *  shared	BOOLEAN	This setting should be set to true when multiple cache instances share the same
           * cache store (e.g., multiple nodes in a cluster using a JDBC-based CacheStore pointing to the same, shared
           * database.) Setting this to true avoids multiple cache instances writing the same modification multiple
           * times. If enabled, only the node where the modification originated will write to the cache store. If
           * disabled, each individual cache reacts to a potential remote update by storing the data to the cache store.
           *
           *  preload	BOOLEAN	If true, when the cache starts, data stored in the cache store will be pre-loaded
           * into memory. This is particularly useful when data in the cache store will be needed immediately after
           * startup and you want to avoid cache operations being delayed as a result of loading this data lazily. Can
           * be used to provide a 'warm-cache' on startup, however there is a performance penalty as startup time is
           * affected by this process.
           *
           *  passivation	BOOLEAN	If true, data is only written to the cache store when it is evicted from memory,
           * a phenomenon known as 'passivation'. Next time the data is requested, it will be 'activated' which means
           * that data will be brought back to memory and removed from the persistent store. f false, the cache store
           * contains a copy of the contents in memory, so writes to cache result in cache store writes. This essentially
           * gives you a 'write-through' configuration.
           *
           *  fetch-state	BOOLEAN	If true, fetch persistent state when joining a cluster. If multiple cache stores
           * are chained, only one of them can have this property enabled.
           *
           *  purge	BOOLEAN	If true, purges this cache store when it starts up.
           *
           *  read-only	BOOLEAN	If true, the cache store will only be used to load entries. Any modifications made
           * to the caches will not be applied to the store.
           *
           *  singleton	BOOLEAN	If true, the singleton store cache store is enabled. SingletonStore is a delegating
           * cache store used for situations when only one instance in a cluster should interact with the underlying store.
           *
           *  datasource	STRING	A datasource reference for this datastore.
           *
           *  dialect	STRING	The dialect of this datastore.
           *
           *
           */
          CacheCreationControllerClient.prototype.createJDBCStoreNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'shared': prop.shared,
              'preload': prop.preload,
              'passivation': prop.passivation,
              'fetch-state': prop['fetch-state'],
              'purge' : prop.purge,
              'read-only' : prop['read-only'],
              'singleton' : prop.singleton,
              'datasource' : prop.datasource,
              'dialect' : prop.dialect,
              'string-keyed-table': prop['string-keyed-table'],
              'binary-keyed-table': prop['binary-keyed-table'],
              'address': address
            };
            return this.execute(op);
          };

          /**
           * Creates new cache transaction configuration element
           *
           *
           * @param address
           *
           * Parameter @param prop has the following properties:
           *
           *  mode	STRING	Sets the clustered cache mode, ASYNC for asynchronous operation, or SYNC for synchronous operation.
           *
           *  locking	STRING	The locking configuration of the cache.
           *
           *  stop-timeout	LONG	If there are any ongoing transactions when a cache is stopped, Infinispan waits
           * for ongoing remote and local transactions to finish. The amount of time to wait for is defined by the cache stop timeout.
           *
           */
          CacheCreationControllerClient.prototype.createTransactionNode = function (address, prop) {
            var op = {
              'operation': 'add',
              'mode': prop.mode,
              'locking': prop.locking,
              'stop-timeout': prop['stop-timeout'],
              'address': address
            };
            return this.execute(op);
          };
          return new CacheCreationControllerClient(window.location.origin);
    }
  ]);
