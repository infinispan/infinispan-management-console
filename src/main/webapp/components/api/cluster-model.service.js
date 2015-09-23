'use strict';

angular.module('managementConsole.api')
    .factory('ClusterModel', [
    '$q',
    'CacheModel',
    'EndpointModel',
    'utils',
    function ($q, CacheModel, EndpointModel, utils) {
            var Cluster = function (name, profile, path, domain) {
                this.name = name;
                this.profile = profile;
                this.path = path;
                this.domain = domain;
                this.modelController = domain.getModelController();
                this.lastRefresh = null;
                this.caches = {};
                this.cachesMetadata = null;
                this.availability = null;
                this.endpoints = [];
            };

            Cluster.prototype.getModelController = function () {
                return this.modelController;
            };

            Cluster.prototype.getResourcePath = function () {
                return this.path.concat('subsystem', 'datagrid-infinispan', 'cache-container', this.name);
            };

            Cluster.prototype.refresh = function () {
                this.modelController.readResourceDescription(this.getResourcePath(), true, false).then(function (response) {
                  this.cachesMetadata = response;
                }.bind(this));
                return this.modelController.readResource(this.getResourcePath(), true, false).then(function (response) {
                    this.lastRefresh = new Date();
                    this.caches = {};
                    this.getAvailability();
                    var cachePromises = [];
                    var cacheTypes = ['local-cache', 'distributed-cache', 'replicated-cache', 'invalidation-cache'];
                    for (var i = 0; i < cacheTypes.length; i++) {
                        var typedCaches = response[cacheTypes[i]];
                        if (typedCaches !== undefined) {
                            for (var name in typedCaches) {
                                if (name !== undefined) {
                                    var cache = new CacheModel(name, cacheTypes[i], typedCaches[name].configuration, this);
                                    this.caches[name] = cache;
                                    cachePromises.push(cache.refresh());
                                }
                            }
                        }
                    }
                    return $q.all(cachePromises);
                }.bind(this));
            };

            Cluster.prototype.getAvailability = function () {
              // We are checking cluster availability on the first server
              // Is here any was how to check cluster availability globally?
              var resourcePathCacheContainer = this.domain.getFirstServerResourceRuntimePath()
                .concat('subsystem', 'datagrid-infinispan', 'cache-container', this.name);

              return this.modelController.readAttribute(resourcePathCacheContainer, 'cluster-availability').then(function (response){
                this.availability = response.toUpperCase();
              }.bind(this));
            };

            Cluster.prototype.getEndpoints = function () {
              var socketEndpoints = [];
              var socketBindings = this.domain.getServerGroup().getSocketBindings();
              var offset = this.domain.getServerGroup().getSocketPortBindingOffset();
              var endpoints = this.domain.getProfile(this.profile).getEndpoints();
              angular.forEach(endpoints, function(value, key, obj){
                 var endpoint = value[key];
                 var bindingName = endpoint['socket-binding'];
                 var bindingPort = socketBindings[bindingName].port;
                 var fixedPort = socketBindings[bindingName]['fixed-port'];
                 socketEndpoints.push(new EndpointModel(bindingName,
                  !fixedPort? bindingPort + offset: bindingPort,
                  utils.isNotNullOrUndefined(endpoint.encryption) ? endpoint.encryption : ""));
              });
              return socketEndpoints;
            };

            Cluster.prototype.getRelays = function () {
              var relays = [];
              var stacks = this.domain.getProfile(this.profile).getJGroups()['stack'];
              angular.forEach(stacks, function(stack, key){
                if (utils.isNotNullOrUndefined(stack['relay']) && utils.isNotNullOrUndefined(stack['relay']['RELAY'])){
                  relays.push(stack['relay']['RELAY']);
                }
              });
              return relays;
            };

            Cluster.prototype.isAvailable = function () {
              return this.availability === 'AVAILABLE';
            };


            Cluster.prototype.getNodes = function () {
                return this.domain.getNodes();
            };

            Cluster.prototype.getCaches = function () {
                return this.caches;
            };

            Cluster.prototype.getCachesAsArray = function () {
              var caches = this.getCaches();
              return Object.keys(caches).map(function (key) {
                return caches[key];
              });
            };

            Cluster.prototype.hasCaches = function () {
              return utils.isNonEmptyArray(this.getCachesAsArray());
            };

            Cluster.prototype.hasNodes = function () {
              return utils.isNonEmptyArray(this.getNodes());
            };

            return Cluster;
    }
  ]);
