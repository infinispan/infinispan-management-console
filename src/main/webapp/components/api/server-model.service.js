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
                this.defaultStack = 'N/A';
            };

            Server.prototype.getResourcePath = function () {
                return this.domain.getResourcePath().concat('host', this.host, 'server', this.server);
            };

            Server.prototype.getModelController = function () {
                return this.domain.getModelController();
            };

            Server.prototype.getDefaultStack = function () {
              return this.defaultStack;
            };

            Server.prototype.refresh = function () {
                this.getModelController().readAttribute(this.getResourcePath(), 'server-state').then(function (response) {
                    this.state = response.toUpperCase();
                }.bind(this));
                this.getModelController().readAttributeAndResolveExpressions(this.getResourcePath().concat('subsystem', 'datagrid-jgroups'),
                  'default-stack', true).then(function (response) {
                  this.defaultStack = response.toUpperCase();
                }.bind(this));
            };

            Server.prototype.fetchCacheStats = function(cache) {
                return this.getModelController()
                    .readResource(this.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container', cache.cluster.name, cache.type, cache.name),
                                  false, true).then(function (response) {
                    response['node-name'] = this.name;
                    response['cache'] = this;
                    return response;
                }.bind(this));
            };

            Server.prototype.fetchAggregateNodeStats = function (cluster) {
              return this.getModelController()
                .readResource(this.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.name),
                false, true).then(function (response) {
                  return response;
                }.bind(this));
            };

            Server.prototype.isRunning = function() {
              return this.state === 'RUNNING' || this.state === 'RELOAD_REQUIRED' || this.state === 'RESTART_REQUIRED';
            };

            return Server;
    }
  ]);
