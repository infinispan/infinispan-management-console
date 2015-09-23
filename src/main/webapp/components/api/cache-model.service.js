'use strict';

angular.module('managementConsole.api')
    .factory('CacheModel', [
    'utils',
    function (utils) {
            var Cache = function (name, type, configurationTemplate, cluster) {
                this.name = name;
                this.type = type;
                this.configurationTemplate = configurationTemplate;
                this.cluster = cluster;
                this.modelController = cluster.getModelController();
                this.lastRefresh = null;
                this.data = null;
                this.show = true;
                this.configuration = null;
            };

            Cache.prototype.getModelController = function () {
                return this.modelController;
            };

            Cache.prototype.getResourcePath = function () {
                return this.cluster.getResourcePath().concat(this.type, this.name);
            };

            Cache.prototype.refresh = function () {
                this.modelController.readResource(this.getConfigurationPath(), true, false).then(function(response){
                  this.configuration = response;
                }.bind(this));
                this.modelController.readResource(this.getResourcePath(), true, false).then(function (response) {
                    this.data = response;
                    this.lastRefresh = new Date();
                }.bind(this));
            };

            Cache.prototype.getConfigurationPath = function () {
              return this.cluster.getResourcePath().concat('configurations', 'CONFIGURATIONS', this.type + '-configuration', this.configurationTemplate);
            };

            Cache.prototype.isDistributed = function () {
              return this.type === 'distributed-cache';
            };

            Cache.prototype.isReplicated = function () {
              return this.type === 'replicated-cache';
            };

            Cache.prototype.isLocal = function () {
              return this.type === 'local-cache';
            };

            Cache.prototype.isInvalidation = function () {
              return this.type === 'invalidation-cache';
            };

            Cache.prototype.isIndexed = function () {
              return utils.isNotNullOrUndefined(this.configuration.indexing);
            };

            Cache.prototype.isPersistent = function () {
              return utils.isNotNullOrUndefined(this.configuration['file-store'])
                || utils.isNotNullOrUndefined(this.configuration['leveldb-store'])
                || utils.isNotNullOrUndefined(this.configuration['rest-store'])
                || utils.isNotNullOrUndefined(this.configuration['store'])
                || utils.isNotNullOrUndefined(this.configuration['binary-keyed-jdbc-store'])
                || utils.isNotNullOrUndefined(this.configuration['string-keyed-jdbc-store'])
                || utils.isNotNullOrUndefined(this.configuration['mixed-keyed-jdbc-store']);
            };

            Cache.prototype.hasCompatibility = function () {
              return utils.isNotNullOrUndefined(this.configuration.compatibility);
            };

            Cache.prototype.hasSecurityEnabled = function () {
              return utils.isNotNullOrUndefined(this.configuration.security);
            };

            Cache.prototype.hasRemoteBackup = function () {
              return utils.isNotNullOrUndefined(this.configuration.remotebackup);
            };

            Cache.prototype.isBounded = function () {
              return utils.isNotNullOrUndefined(this.configuration.eviction);
            };

            Cache.prototype.isTransactional = function () {
              return utils.isNotNullOrUndefined(this.configuration.transaction);
            };

            return Cache;
    }
  ]);
