'use strict';

angular.module('managementConsole.api')
    .factory('CacheModel', [

    function () {
            var Cache = function (name, type, domain, cluster, serverName) {
                this.name = name;
                this.type = type;
                this.cluster = cluster;
                this.domain = domain;
                this.serverName = serverName;
                this.modelController = cluster.getModelController();
                this.lastRefresh = null;
                this.data = null;
                this.cacheAvailability = this.refreshCacheAvailability();
                this.cacheStatus = this.refreshCacheStatus();
            };

            Cache.prototype.getModelController = function () {
                return this.modelController;
            };

            Cache.prototype.getResourcePath = function () {
                return this.cluster.getResourcePath().concat(this.type, this.name);
            };

            Cache.prototype.refresh = function () {
                return this.modelController.readResource(this.getResourcePath(), false, true).then(function (response) {
                    this.refreshCacheAvailability();
                    this.refreshCacheStatus();
                    this.data = response;
                    this.lastRefresh = new Date();
                }.bind(this));
            };

            Cache.prototype.refreshCacheAvailability = function () {
                this.domain.fetchCacheStatsForOneServer(this.serverName, this).then(function(response) {
                    this.cacheAvailability = response['cache-availability'];
                }.bind(this), function(error) {
                    // TODO: hard-set here; are we able to read it somehow? When cache is terminated/stopped?
                    this.cacheAvailability = 'UNAVAILABLE';
                    console.log('Could not get cache status: ' + error);
                }.bind(this));
            };

            Cache.prototype.refreshCacheStatus = function () {
                this.domain.fetchCacheStatsForOneServer(this.serverName, this).then(function(response) {
                    this.cacheStatus = response['cache-status'];
                }.bind(this), function(error) {
                    // TODO: hard-set here; are we able to read it somehow? When cache is terminated/stopped?
                    this.cacheStatus = 'TERMINATED';
                    console.log('Could not get cache status: ' + error);
                }.bind(this));
            };

            return Cache;
    }
  ]);