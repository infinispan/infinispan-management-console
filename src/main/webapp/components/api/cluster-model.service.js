'use strict';

angular.module('managementConsole.api')
    .factory('ClusterModel', [
    '$q',
    'CacheModel',
    'EndpointModel',
    'utils',
    function ($q, CacheModel, EndpointModel, utils) {
            var Cluster = function (name, profile, path, domain, serverGroupName) {
                this.name = name;
                this.profile = profile;
                this.path = path;
                this.domain = domain;
                this.modelController = domain.getModelController();
                this.lastRefresh = null;
                this.caches = {};
                this.metadata = null;
                this.availability = null;
                this.rebalancingStatus = null;
                this.endpoints = [];
                this.security = null;
                this.threadpool = null;
                this.transport = null;
                this.configurations = null;
                this.serverGroupName = serverGroupName;
            };

            Cluster.prototype.getModelController = function () {
                return this.modelController;
            };

            Cluster.prototype.getServerGroupName = function () {
              return this.serverGroupName;
            };

            Cluster.prototype.getProfileName = function () {
              return this.profile;
            };

            Cluster.prototype.getResourcePath = function () {
                return this.path.concat('subsystem', 'datagrid-infinispan', 'cache-container', this.name);
            };

            Cluster.prototype.refresh = function () {
              this.modelController.readResourceDescription(this.getResourcePath(), true, false).then(function (response) {
                this.metadata = response;
              }.bind(this));
              return this.modelController.readResource(this.getResourcePath(), true, false).then(function (response) {
                this.configurations = response.configurations.CONFIGURATIONS;
                this.lastRefresh = new Date();
                this.caches = {};
                var cachePromises = [];
                var cacheTypes = ['local-cache', 'distributed-cache', 'replicated-cache', 'invalidation-cache'];
                for (var i = 0; i < cacheTypes.length; i++) {
                  var cacheType = cacheTypes[i];
                  var typedCaches = response[cacheType];
                  if (typedCaches !== undefined) {
                    for (var name in typedCaches) {
                      if (name !== undefined) {
                        var configurationName = typedCaches[name].configuration;
                        var confModel = this.getConfigurationModel(cacheType, configurationName);
                        var cache = new CacheModel(name, cacheTypes[i], configurationName, confModel, this);
                        this.caches[name] = cache;
                        cachePromises.push(cache.refresh());
                      }
                    }
                  }
                }
                this.threadpool = response['thread-pool'];
                this.security = response.security;
                this.transport = response.transport;
                return $q.all(cachePromises);
              }.bind(this)).then(function () {
                this.getAvailability();
              }.bind(this)).then(function () {
                this.getRebalancingStatus();
              }.bind(this));
            };

            Cluster.prototype.getConfigurationModel = function (cacheType, name) {
              return this.getConfigurationsByTypeAndName(cacheType, name);
            };

            Cluster.prototype.getConfigurations = function () {
              return this.modelController.readResource(this.getResourcePath().concat('configurations', 'CONFIGURATIONS'), true, false).then(function (response) {
                this.configurations = response;
                return response;
              }.bind(this));
            };

            Cluster.prototype.getConfigurationsByTypeAndName = function (cacheType, name) {
              return this.configurations[cacheType + '-configuration'][name];
            };

            Cluster.prototype.getConfigurationsByType = function (cacheType) {
              return this.configurations[cacheType + '-configuration'];
            };

            Cluster.prototype.getConfigurationsTemplates = function () {
              return this.getConfigurationTemplatesFromModel(this.configurations);
            };

            Cluster.prototype.getSecurityConfiguration = function () {
              return this.modelController.readResource(this.getResourcePath().concat('security', 'SECURITY'), true, false);
            };

            Cluster.prototype.getConfigurationTemplatesFromModel = function (inputConfigurationTemplates) {
              var configurationTemplates = [];
              angular.forEach(['distributed-cache', 'replicated-cache', 'invalidation-cache', 'local-cache'], function (cacheType) {
                var templatesForType = inputConfigurationTemplates[cacheType + '-configuration'];
                angular.forEach(templatesForType, function (template, templateName) {
                  template.name = templateName;
                  template.type = cacheType;
                  configurationTemplates.push(template);
                });
              }.bind(this));
              return configurationTemplates;
            };

            Cluster.prototype.getAvailability = function () {
              // We are checking cluster availability on the first server
              // Is here any was how to check cluster availability globally?
              var resourcePathCacheContainer = this.getNodes()[0].getResourcePath()
                .concat('subsystem', 'datagrid-infinispan', 'cache-container', this.name);

              return this.modelController.readAttribute(resourcePathCacheContainer, 'cluster-availability').then(function (response){
                this.availability = response.toUpperCase();
              }.bind(this)).catch(function (){
                this.availability = 'UNAVAILABLE';
              }.bind(this));
            };

            Cluster.prototype.getRebalancingStatus= function () {
              var resourcePathCacheContainer = this.getNodes()[0].getResourcePath()
                .concat('subsystem', 'datagrid-infinispan', 'cache-container', this.name);
              return this.modelController.readAttribute(resourcePathCacheContainer, 'cluster-rebalance').then(function (response){
                this.rebalancingStatus = response;
              }.bind(this));
            };

            Cluster.prototype.getEndpoints = function () {
              var socketEndpoints = [];
              var socketBindings = this.domain.getServerGroup().getSocketBindings();
              var offset = this.domain.getServerGroup().getSocketPortBindingOffset();
              var endpoints = this.getProfile().getEndpoints();
              angular.forEach(endpoints, function(value, key){
                 var endpoint = value[key];
                 var bindingName = endpoint['socket-binding'];
                 var bindingPort = socketBindings[bindingName].port;
                 var fixedPort = socketBindings[bindingName]['fixed-port'];
                 socketEndpoints.push(new EndpointModel(bindingName,
                  !fixedPort? bindingPort + offset: bindingPort,
                  utils.isNotNullOrUndefined(endpoint.encryption) ? endpoint.encryption : ''));
              });
              return socketEndpoints;
            };

            Cluster.prototype.getRelays = function () {
              var relays = [];
              var stacks = this.getProfile().getJGroups().stack;
              angular.forEach(stacks, function(stack){
                if (utils.isNotNullOrUndefined(stack.relay) && utils.isNotNullOrUndefined(stack.relay.RELAY)){
                  relays.push(stack.relay.RELAY);
                }
              });
              return relays;
            };

            Cluster.prototype.isAvailable = function () {
              return this.availability === 'AVAILABLE';
            };

            Cluster.prototype.getAvailable = function () {
              return this.availability;
            };

            Cluster.prototype.getName = function () {
              return this.name;
            };

            Cluster.prototype.getMetadata = function () {
              return this.metadata;
            };

            Cluster.prototype.getNodes = function () {
              var nodes = [];
              angular.forEach(this.domain.getNodes(), function (node) {
                if (node.getGroup() === this.serverGroupName) {
                  nodes.push(node);
                }
              }.bind(this));
              return nodes;
            };

            Cluster.prototype.getProfile = function () {
              return this.domain.getProfile(this.profile);
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

            Cluster.prototype.hasCache = function (cacheName) {
              if (this.hasCaches()) {
                return this.getCachesAsArray().some(function (cache) {
                  return cache.getName() === cacheName;
                });
              } else {
                return false;
              }
            };

            Cluster.prototype.hasNodes = function () {
              return utils.isNonEmptyArray(this.getNodes());
            };

            Cluster.prototype.getTransportConfiguration = function () {
              if (utils.isNotNullOrUndefined(this.transport)) {
                return this.transport.TRANSPORT;
              } else {
                return this.transport;
              }
            };

            Cluster.prototype.getThreadpoolConfiguration = function () {
              return this.threadpool;
            };

            return Cluster;
    }
  ]);
