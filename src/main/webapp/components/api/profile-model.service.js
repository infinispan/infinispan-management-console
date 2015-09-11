'use strict';

angular.module('managementConsole.api')
    .factory('ProfileModel', [
    '$q',
    'ClusterModel',
    function ($q, ClusterModel) {
            /**
             * Represents a Profile which contains the static configuration of all subsystems.
             */
            var Profile = function (name, domain) {
                this.name = name;
                this.domain = domain;
                this.lastRefresh = null;
                this.clusters = [];
                this.endpoints = {};
                this.jgroups = {};
            };

            Profile.prototype.getModelController = function () {
                return this.domain.getModelController();
            };

            Profile.prototype.getResourcePath = function () {
                return this.domain.getResourcePath().concat('profile', this.name);
            };

            Profile.prototype.refresh = function () {
                this.clusters = [];
                return this.getModelController().readResource(this.getResourcePath(), true, false).then(function (response) {
                    this.lastRefresh = new Date();
                    var allClusters = {};
                    var clusterPromises = [];
                    if (response.subsystem !== undefined && response.subsystem['datagrid-infinispan'] !== undefined) {
                        for (var name in response.subsystem['datagrid-infinispan']['cache-container']) {
                            if (name !== undefined && !(name in allClusters)) {
                                allClusters[name] = new ClusterModel(name, this.name, this.getResourcePath(), this.domain);
                            }
                        }
                    }
                    if (response.subsystem !== undefined && response.subsystem['datagrid-infinispan-endpoint'] !== undefined) {
                      this.endpoints = response.subsystem['datagrid-infinispan-endpoint'];
                    }
                    if (response.subsystem !== undefined && response.subsystem['datagrid-jgroups'] !== undefined) {
                      this.jgroups = response.subsystem['datagrid-jgroups'];
                    }
                    for(var i in allClusters) {
                        if (i !== undefined) {
                            this.clusters.push(allClusters[i]);
                            clusterPromises.push(allClusters[i].refresh());
                        }
                    }
                    return $q.all(clusterPromises);
                }.bind(this));
            };

            Profile.prototype.getClusters = function() {
                return this.clusters;
            };

            Profile.prototype.getEndpoints = function() {
              return this.endpoints;
            };

            Profile.prototype.getJGroups = function() {
              return this.jgroups;
            };

            return Profile;
    }
  ]);
