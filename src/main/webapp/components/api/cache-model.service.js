'use strict';

angular.module('managementConsole.api')
    .factory('CacheModel', [

    function () {
            var Cache = function (name, type, cluster) {
                this.name = name;
                this.type = type;
                this.cluster = cluster;
                this.modelController = cluster.getModelController();
                this.lastRefresh = null;
                this.data = null;
                this.show = true;
            };

            Cache.prototype.getModelController = function () {
                return this.modelController;
            };

            Cache.prototype.getResourcePath = function () {
                return this.cluster.getResourcePath().concat(this.type, this.name);
            };

            Cache.prototype.refresh = function () {
                return this.modelController.readResource(this.getResourcePath(), true, true).then(function (response) {
                    this.data = response;
                    this.lastRefresh = new Date();
                }.bind(this));
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

            return Cache;
    }
  ]);
