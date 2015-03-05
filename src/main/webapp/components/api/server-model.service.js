'use strict';

angular.module('managementConsole.api')
    .factory('ServerModel', [

    function () {
            /**
             * Represents a Server
             */
            var Server = function (host, server, group, domain) {
                this.host = host;
                this.server = server;
                this.name = (server === null) ? host : host + '/' + server;
                this.group = group;
                this.domain = domain;
                this.lastRefresh = null;
                this.state = 'UNKNOWN';
                this.show = true;
            };

            Server.prototype.getResourcePath = function () {
                return this.domain.getResourcePath().concat('host', this.host, 'server', this.server);
            };

            Server.prototype.getModelController = function () {
                return this.domain.getModelController();
            };

            Server.prototype.refresh = function () {
                return this.getModelController().readAttribute(this.getResourcePath(), 'server-state').then(function (response) {
                    this.state = response.toUpperCase();
                }.bind(this));
            };

            Server.prototype.fetchCacheStats = function(cache) {
                return this.getModelController()
                    .readResource(this.getResourcePath().concat('subsystem', 'infinispan', 'cache-container', cache.cluster.name, cache.type, cache.name),
                                  false, true).then(function (response) {
                    response['node-name'] = this.name;
                    response['cache'] = this;
                    return response;
                }.bind(this));
            };

            Server.prototype.fetchAggregateNodeStats = function (cluster) {
              return this.getModelController()
                .readResource(this.getResourcePath().concat('subsystem', 'infinispan', 'cache-container', cluster.name),
                false, true).then(function (response) {
                  return response;
                }.bind(this));
            };

            Server.prototype.isRunning = function() {
                return this.state === 'RUNNING';
            };

            return Server;
    }
  ]);