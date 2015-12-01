'use strict';

angular.module('managementConsole.api')
    .factory('CacheModel', [
    'utils',
    function (utils) {
            var Cache = function (name, type, configurationTemplate, confModel, cluster) {
                this.name = name;
                this.type = type;
                this.configurationTemplate = configurationTemplate;
                this.cluster = cluster;
                this.modelController = cluster.getModelController();
                this.lastRefresh = null;
                this.data = null;
                this.show = true;
                this.configuration = confModel;
            };

            Cache.prototype.getModelController = function () {
                return this.modelController;
            };

            Cache.prototype.getResourcePath = function () {
                return this.cluster.getResourcePath().concat(this.type, this.name);
            };

            Cache.prototype.refresh = function () {
              //TODO avoid doing anything here
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

            Cache.prototype.getType = function () {
              return this.type;
            };

            Cache.prototype.getCluster = function () {
              return this.cluster;
            };

            Cache.prototype.getConfigurationTemplate = function () {
              return this.configurationTemplate;
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

            Cache.prototype.start = function () {
              return this.executeOp('start-cache');
            };

            Cache.prototype.stop = function () {
              return this.executeOp('stop-cache');
            };

            Cache.prototype.enable = function () {
              var profile = this.getCluster().getProfile();
              var endpointAddress = profile.getResourcePath().concat('subsystem','datagrid-infinispan-endpoint');
              var op = {
                'operation': 'unignore-cache-all-endpoints',
                'cache-names':[this.name],
                'address': endpointAddress
              };
              return this.getModelController().execute(op);
            };

            Cache.prototype.disable = function () {
              var profile = this.getCluster().getProfile();
              var endpointAddress = profile.getResourcePath().concat('subsystem','datagrid-infinispan-endpoint');
              var op = {
                'operation': 'ignore-cache-all-endpoints',
                'cache-names':[this.name],
                'address': endpointAddress
              };
              return this.getModelController().execute(op);
            };

            Cache.prototype.flush = function () {
              return this.executeOp('flush-cache');
            };

            Cache.prototype.resetStats = function () {
              return this.executeOp('reset-statistics');
            };

            Cache.prototype.executeOp = function (operationName){
              var address = this.getResourcePath();
              var op = {
                'operation': operationName,
                'address': address
              };
              return this.getModelController().execute(op);
            };

            return Cache;
    }
  ]);
