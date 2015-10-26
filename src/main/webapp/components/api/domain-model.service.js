'use strict';

angular.module('managementConsole.api')
    .factory('DomainModel', [
    '$q',
    'ClusterModel',
    'ProfileModel',
    'ServerGroupModel',
    'ServerModel',
    function ($q, ClusterModel, ProfileModel, ServerGroupModel, ServerModel) {
            var Domain = function (modelController, info) {
                this.modelController = modelController;
                this.lastRefresh = null;
                this.info = info;
                this.name = this.info.name;
                this.serverGroups = {};
                this.profiles = {};
                this.hosts = [];
                this.servers = [];
            };

            Domain.prototype.getModelController = function () {
                return this.modelController;
            };

            Domain.prototype.getResourcePath = function () {
                return [];
            };

            Domain.prototype.getHosts = function () {
              return this.hosts;
            };

            Domain.prototype.getFirstServer = function () {
              return this.servers[0];
            };

            Domain.prototype.refreshServers = function () {
              this.servers = [];
              this.hosts = [];
              return this.modelController.readChildrenResources(this.getResourcePath(), 'host', 2, true, true).then(function (response) {
                var serverPromises = [];
                for (var hostName in response) {
                  if (hostName !== undefined) {
                    this.hosts.push(hostName);
                    var host = response[hostName];
                    for (var serverName in host.server) {
                      if (serverName !== undefined) {
                        var server = new ServerModel(hostName, serverName, host.server[serverName], this);
                        this.servers.push(server);
                        serverPromises.push(server.refresh());
                      }
                    }
                  }
                }
                return $q.all(serverPromises);
              }.bind(this));
            };

            Domain.prototype.refresh = function () {
              //first need to refresh servers and then everything else (we need the two to be synchronous)
              return this.refreshServers().then(function (){
                return this.refreshOther();
              }.bind(this));
            };

            Domain.prototype.refreshOther = function () {
              var promises = [];

              var serverGroupPromise = this.modelController.readChildrenResources(this.getResourcePath(), 'server-group', 1, true, false).then(function (response) {
                this.serverGroups = {};
                var serverGroupPromises = [];
                for (var name in response) {
                  if (name !== undefined) {
                    this.serverGroups[name] = new ServerGroupModel(name, response[name].profile, this);
                    serverGroupPromises.push(this.serverGroups[name].refresh());
                  }
                }
                return $q.all(serverGroupPromises);
              }.bind(this));
              promises.push(serverGroupPromise);

              var profilePromise = this.modelController.readChildrenResources(this.getResourcePath(), 'profile', 1, true, false).then(function (response) {
                this.profiles = {};
                var profilePromises = [];
                for (var name in response) {
                  if (name !== undefined) {
                    this.profiles[name] = new ProfileModel(name, this);
                    profilePromises.push(this.profiles[name].refresh());
                  }
                }
                return $q.all(profilePromises);
              }.bind(this));
              promises.push(profilePromise);


              return $q.all(promises);
            };


            Domain.prototype.getClusters = function () {
                var clusters = [];
                for (var name in this.profiles) {
                    if (name !== undefined) {
                        clusters = clusters.concat(this.profiles[name].getClusters());
                    }
                }
                return clusters;
            };

            Domain.prototype.getCluster = function (clusters, name) {
                for (var i = 0; i < clusters.length; i++) {
                    if (clusters[i].name === name) {
                        return clusters[i];
                    }
                }
                return null;
            };

            Domain.prototype.getNodes = function () {
                return this.servers;
            };


            Domain.prototype.getNode = function (serverNodeName) {
              var serverNode;
              var serverNodes = this.getNodes();
              for (var i = 0, len = serverNodes.length; i < len; i++) {
                if (serverNodes[i].getName() === serverNodeName) {
                  serverNode = serverNodes[i];
                  break;
                }
              }
              return serverNode;
            };

            Domain.prototype.getServerGroupName = function () {
              return this.getNodes()[0].getGroup();
            };

            Domain.prototype.getServerGroup = function () {
              return this.getServerGroupByName(this.getServerGroupName());
            };

            Domain.prototype.getServerGroupByName = function (serverGroupName) {
              return this.serverGroups[serverGroupName];
            };

            Domain.prototype.getServerGroups = function () {
              return this.serverGroups;
            };

            Domain.prototype.getProfile = function (profileName) {
              return this.profiles[profileName];
            };


            Domain.prototype.fetchCacheStats = function(cluster, cache) {
                var promises = [];
                for(var i=0; i<this.servers.length; i++) {
                    var server = this.servers[i];
                    if (server.isRunning()) {
                        var serverGroup = this.serverGroups[server.getGroup()];
                        var serverProfile = this.profiles[serverGroup.profile];
                        if (serverProfile.name === cluster.profile) {
                            promises.push(server.fetchCacheStats(cache));
                        }
                    }
                }
                var q = $q.all(promises);
                return q;
            };

            Domain.prototype.fetchNodeStats = function(cluster, server) {
                var promises = [];
                if (server.isRunning()) {
                    var serverGroup = this.serverGroups[server.getGroup()];
                    var serverProfile = this.profiles[serverGroup.profile];
                    var caches = cluster.getCaches();
                    for (var name in caches) {
                        var cache = caches[name];
                        promises.push(server.fetchCacheStats(cache));
                    }
                }
                var q = $q.all(promises);
                return q;
            };

            Domain.prototype.fetchAggregateNodeStats = function (cluster, server) {
              var deferred = $q.defer();
              if (server.isRunning()) {
                deferred.resolve(server.fetchAggregateNodeStats(cluster));
              } else {
                deferred.resolve(undefined);
              }
              return deferred.promise;
            };

            return Domain;
    }
  ]);
