'use strict';

angular.module('managementConsole.api')
    .factory('DomainModel', [
    'ClusterModel',
    'NodeModel',
    function (ClusterModel, NodeModel) {
            var Domain = function (modelController, info) {
                this.modelController = modelController;
                this.lastRefresh = null;
                this.info = info;
                this.name = this.info.name;
            };

            Domain.prototype.getModelController = function () {
                return this.modelController;
            };

            Domain.prototype.getResourcePath = function () {
                return [];
            };

            Domain.prototype.refresh = function (callback) {
                this.modelController.readChildrenResources(this.getResourcePath(), 'host', true, true, false, function (response) {
                    this.name = response.name;
                    this.data = response;
                    this.lastRefresh = new Date();
                    if (callback) {
                        callback(this);
                    }
                }.bind(this));
            };

            Domain.prototype.getClusters = function () {
                var allClusters = {};
                for (var host in this.data) {
                    if (host !== undefined) {
                        var hostData = this.data[host];
                        for (var server in hostData.server) {
                            if (server !== undefined) {
                                var serverData = hostData.server[server];
                                if (serverData.subsystem !== undefined && serverData.subsystem.infinispan !== undefined) {
                                    for (var name in serverData.subsystem.infinispan['cache-container']) {
                                        if (name !== undefined && !(name in allClusters)) {
                                            allClusters[name] = new ClusterModel(this, host, server, name);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var clusters = [];
                for (var cluster in allClusters) {
                    if (cluster !== undefined) {
                        clusters.push(allClusters[cluster]);
                    }
                }
                return clusters;
            };

            Domain.prototype.getNodes = function () {
                var nodes = [];
                for (var host in this.data) {
                    if (host !== undefined) {
                        for (var server in host.server) {
                            if (server !== undefined) {
                                nodes.push(new NodeModel(host, server, this.getModelController()));
                            }
                        }
                    }
                }
                return nodes;
            };

            return Domain;
    }
  ]);