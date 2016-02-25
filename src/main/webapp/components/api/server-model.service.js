'use strict';

angular.module('managementConsole.api')
    .factory('ServerModel', [

    function () {
            /**
             * Represents a Server
             */
            var Server = function (host, server, rootOfServer, domain) {
                this.host = host;
                this.server = server;
                this.name = (server === null) ? host : host + '/' + server;
                this.root = rootOfServer;
                this.domain = domain;
                this.lastRefresh = null;
                this.show = true;
                this.defaultStack = 'N/A';
                this.inetAddress = 'N/A';
                this.stats = {};
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

            Server.prototype.getGroup = function () {
              return this.root['server-group'];
            };

            Server.prototype.getState = function () {
              return this.root['server-state'].toUpperCase();
            };

            Server.prototype.isStopped = function () {
              return this.getState() === 'STOPPED';
            };

            Server.prototype.getInetAddress = function () {
              return this.inetAddress;
            };

            Server.prototype.getName = function () {
              return this.name;
            };

            Server.prototype.getServerName = function () {
              return this.server;
            };

            Server.prototype.getHost = function () {
              return this.host;
            };

            Server.prototype.getDomain = function () {
              return this.domain;
            };

            Server.prototype.refresh = function () {
                this.getModelController().readAttributeAndResolveExpressions(this.getResourcePath().concat('subsystem', 'datagrid-jgroups'),
                  'default-stack', true).then(function (response) {
                  this.defaultStack = response.toUpperCase();
                }.bind(this)).catch(function(){
                    this.defaultStack = 'N/A';
                  }.bind(this));

                this.getModelController().readAttributeAndResolveExpressions(this.getResourcePath().concat('interface', 'public'),
                  'inet-address', true).then(function (response) {
                  this.inetAddress = response;
                }.bind(this)).catch(function(){
                    this.inetAddress = 'N/A';
                  }.bind(this));
            };

            Server.prototype.refreshState = function () {
              this.getModelController().readResource(this.getResourcePath(), false, true).then(function(response){
                this.root = response;
              }.bind(this));
            };

            Server.prototype.fetchCacheStats = function(cache) {
                return this.getModelController()
                    .readResource(this.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container', cache.cluster.name, cache.type, cache.name),
                                  false, true).then(function (response) {
                    response['node-name'] = this.name;
                    response.cache = this;
                    return response;
                }.bind(this));
            };

            Server.prototype.fetchStats = function () {
              return this.getModelController()
                .readChildrenResources(this.getResourcePath().concat('core-service', 'platform-mbean'),
                'type', 2, true, true).then(function (response) {
                  this.stats = response;
                  return response;
                }.bind(this));
            };

            Server.prototype.fetchAggregateNodeStats = function (cluster) {
              return this.fetchAggregateNodeStatsByClusterName(cluster.name);
            };

            Server.prototype.fetchAggregateNodeStatsByClusterName = function (clusterName) {
              return this.getModelController()
                .readResource(this.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container', clusterName),
                false, true).then(function (response) {
                  return response;
                }.bind(this));
            };

            Server.prototype.fetchAggregateNodeStats = function () {
              return this.getModelController()
                .readResource(this.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container'),
                true, true).then(function (response) {
                  return response;
                }.bind(this));
            };

            Server.prototype.start = function (){
              return this.executeServerOp('start');
            };

            Server.prototype.stop = function (){
              return this.executeServerOp('stop');
            };

            Server.prototype.restart = function (){
              return this.executeServerOp('restart');
            };

            Server.prototype.reload = function (){
              return this.executeServerOp('reload');
            };

            Server.prototype.suspend = function (){
              return this.executeServerOp('suspend');
            };

            Server.prototype.resume = function (){
              return this.executeServerOp('resume');
            };

            Server.prototype.remove = function (){
              return this.executeServerOp('remove');
            };

            Server.prototype.executeServerOp = function (operationName){
              var address = ['host', this.host, 'server-config', this.server];
              var op = {
                'operation': operationName,
                'address': address
              };
              return this.getModelController().execute(op);
            };

            Server.prototype.isRunning = function() {
              var state = this.getState();
              return state === 'RUNNING' || state === 'RELOAD_REQUIRED' || state === 'RESTART_REQUIRED';
            };

            return Server;
    }
  ]);
