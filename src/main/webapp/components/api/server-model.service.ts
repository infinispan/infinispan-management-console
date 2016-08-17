import {App} from "../../App";

const module: ng.IModule = App.module('managementConsole.api.server-model', []);
module.factory('ServerModel', [

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
      this.defaultStack = '';
      this.inetAddress = '';
      this.stats = {};
      this.group = '';
    };

    Server.prototype.getResourcePath = function () {
      return this.domain.getResourcePath().concat('host', this.host, 'server', this.server);
    };

    Server.prototype.getConfigResourcePath = function () {
      return this.domain.getResourcePath().concat('host', this.host, 'server-config', this.server);
    };

    Server.prototype.getModelController = function () {
      return this.domain.getModelController();
    };

    Server.prototype.getDefaultStack = function () {
      return this.defaultStack;
    };

    Server.prototype.getGroup = function () {
      return this.group;
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
      }.bind(this)).catch(function () {
        this.defaultStack = 'N/A';
      }.bind(this));

      this.getModelController().readAttributeAndResolveExpressions(this.getResourcePath().concat('interface', 'public'),
        'inet-address', true).then(function (response) {
        this.inetAddress = response;
      }.bind(this)).catch(function () {
        this.inetAddress = 'N/A';
      }.bind(this));

      this.getModelController().readAttribute(this.getConfigResourcePath(), 'group').then(function (response) {
        this.group = response;
      }.bind(this)).catch(function () {
        this.group = 'N/A';
      }.bind(this));
    };

    Server.prototype.refreshState = function () {
      this.getModelController().readResource(this.getResourcePath(), false, true).then(function (response) {
        this.root = response;
      }.bind(this));
    };

    Server.prototype.fetchCacheStats = function (cache) {
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

    Server.prototype.start = function (blocking) {
      return this.executeServerOp('start', blocking);
    };

    Server.prototype.stop = function (blocking) {
      return this.executeServerOp('stop', blocking);
    };

    Server.prototype.restart = function (blocking) {
      return this.executeServerOp('restart', blocking);
    };

    Server.prototype.reload = function (blocking) {
      return this.executeServerOp('reload', blocking);
    };

    Server.prototype.suspend = function (blocking) {
      return this.executeServerOp('suspend', blocking);
    };

    Server.prototype.resume = function (blocking) {
      return this.executeServerOp('resume', blocking);
    };

    Server.prototype.remove = function (blocking) {
      return this.executeServerOp('remove', blocking);
    };

    Server.prototype.executeServerOp = function (operationName, blocking) {
      blocking = blocking || true;
      var address = ['host', this.host, 'server-config', this.server];
      var op = {
        'operation': operationName,
        'address': address,
        'blocking': blocking
      };
      return this.getModelController().execute(op);
    };

    Server.prototype.isRunning = function () {
      var state = this.getState();
      return state === 'RUNNING' || state === 'RELOAD_REQUIRED' || state === 'RESTART_REQUIRED';
    };

    return Server;
  }
]);
