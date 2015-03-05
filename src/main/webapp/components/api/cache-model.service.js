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
                return this.modelController.readResource(this.getResourcePath(), false, true).then(function (response) {
                    this.data = response;
                    this.lastRefresh = new Date();
                }.bind(this));
            };

            return Cache;
    }
  ]);