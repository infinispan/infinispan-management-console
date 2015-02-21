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
            };

            Cluster.prototype.getModelController = function () {
                return this.modelController;
            };

            Cluster.prototype.getResourcePath = function () {
                return this.path.concat('subsystem', 'infinispan', 'cache-container', this.name);
            };

            Cluster.prototype.refresh = function () {
                return this.modelController.readResource(this.getResourcePath(), false, false).then(function (response) {
                    this.lastRefresh = new Date();
                    this.caches = [];
                    var cachePromises = [];
                    var cacheTypes = ['local-cache', 'distributed-cache', 'replicated-cache', 'invalidation-cache'];
                    for (var i = 0; i < cacheTypes.length; i++) {
                        var typedCaches = response[cacheTypes[i]];
                        if (typedCaches !== undefined) {
                            for (var name in typedCaches) {
                                if (name !== undefined) {
                                    var cache = new CacheModel(name, cacheTypes[i], this);
                                    this.caches.push(cache);
                                    this.cachesNameMap[name] = cache;
                                    cachePromises.push(cache.refresh());
                                }
                            }
                        }
                    }
                    return $q.all(cachePromises);
                }.bind(this));
            };

            Cluster.prototype.getAvailability = function () {};

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

            return Cluster;
    }
  ]);