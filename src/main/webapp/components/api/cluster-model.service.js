'use strict';

angular.module('managementConsole.api')
    .factory('ClusterModel', [
    '$q',
    'CacheModel',
    function ($q, CacheModel) {
            var Cluster = function (name, profile, path, domain) {
                this.name = name;
                this.profile = profile;
                this.path = path;
                this.domain = domain;
                this.modelController = domain.getModelController();
                this.lastRefresh = null;
                this.caches = []; // desired to have caches in an array so we can filter out through their names
                this.cachesNameMap = {}; // hashMap for fast Cache object referencing by cache name
                this.cachesByServerName = {}; // serverName -> [caches]
                this.clusterAvailability = this.refreshClusterAvailability();
            };

            Cluster.prototype.getModelController = function () {
                return this.modelController;
            };

            Cluster.prototype.getResourcePath = function () {
                return this.path.concat('subsystem', 'infinispan', 'cache-container', this.name);
            };

            Cluster.prototype.refresh = function () {
                return this.modelController.readResource(this.getResourcePath(), false, false).then(function (response) {
                    this.refreshClusterAvailability();
                    this.lastRefresh = new Date();
                    this.caches = [];
                    var cachePromises = [];
                    var nodes = this.getNodes();

                    for (var y = 0; y < nodes.length; y++) {
                        var tmpCachesForOneServer = [];
                        var cacheTypes = ['local-cache', 'distributed-cache', 'replicated-cache', 'invalidation-cache'];
                        for (var i = 0; i < cacheTypes.length; i++) {
                            var typedCaches = response[cacheTypes[i]];
                            if (typedCaches !== undefined) {
                                for (var name in typedCaches) {
                                    if (name !== undefined) {

                                        // TODO: All caches on all nodes. Do it on request?
                                        // TODO: Possible bottleneck for big deployments!
                                        var cache = new CacheModel(name, cacheTypes[i], this.domain, this, nodes[y].server);
                                        this.caches.push(cache);
                                        this.cachesNameMap[name] = cache;
                                        tmpCachesForOneServer.push(cache);
                                        cachePromises.push(cache.refresh());
                                    }
                                }
                            }
                        }

                        this.cachesByServerName[nodes[y].server] = tmpCachesForOneServer;
                        tmpCachesForOneServer = [];
                    }
                    return $q.all(cachePromises);
                }.bind(this));
            };

            Cluster.prototype.refreshClusterAvailability = function () {

                // Temporary: we are checking cluster availability on the first server
                // Question: is here any was how to check cluster availability globally?
                var resourcePathCacheContainer = this.domain.getFistServerResourceRuntimePath()
                        .concat('subsystem', 'infinispan', 'cache-container', this.name);

                var promise = this.modelController.readAttribute(resourcePathCacheContainer, 'cluster-availability');
                promise.then(function(response) {
                    this.clusterAvailability = response;
                }.bind(this),
                function(error) {
                    console.log('Could not get cluster availability: ' + error);
                }.bind(this));
            };

            Cluster.prototype.getNodes = function () {
                return this.domain.getNodes();
            };

            /**
             * @returns {Array} caches in a particular Cluster as a common Array
             */
            Cluster.prototype.getCaches = function () {
                return this.caches;
            };

            /**
             * @returns hashMap where Caches are mapped by their names
             */
            Cluster.prototype.getCachesNameMap = function () {
                return this.cachesNameMap;
            };

            Cluster.prototype.getCachesByServerName = function (serverName) {
                return this.cachesByServerName[serverName];
            };

            return Cluster;
    }
  ]);