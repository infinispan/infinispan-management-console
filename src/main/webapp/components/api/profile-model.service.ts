import {App} from "../../App";

const module: ng.IModule = App.module('managementConsole.api.profile-model', []);

module.factory('ProfileModel', [
  '$q',
  'ClusterModel',
  'utils',
  function ($q, ClusterModel, utils) {
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
      var profileName = this.name;
      this.clusters = [];
      return this.getModelController().readResource(this.getResourcePath(), true, false).then(function (response) {
        this.lastRefresh = new Date();
        var allClusters = {};
        var clusterPromises = [];
        if (utils.isNotNullOrUndefined(response.subsystem) && utils.isNotNullOrUndefined(response.subsystem['datagrid-infinispan'])) {
          for (var name in response.subsystem['datagrid-infinispan']['cache-container']) {
            if (name !== undefined && !(name in allClusters)) {
              //find server group where this cluster is deployed

              var serverGroups = this.domain.getServerGroups();
              var groupName = '';
              Object.keys(serverGroups).forEach(function (group) {
                if (serverGroups[group].profile === profileName) {
                  groupName = group;
                }
              });
              allClusters[name] = new ClusterModel(name, this.name, this.getResourcePath(), this.domain, groupName);
            }
          }
        }
        if (utils.isNotNullOrUndefined(response.subsystem) && utils.isNotNullOrUndefined(response.subsystem['datagrid-infinispan-endpoint'])) {
          this.endpoints = response.subsystem['datagrid-infinispan-endpoint'];
        }
        if (utils.isNotNullOrUndefined(response.subsystem) && utils.isNotNullOrUndefined(response.subsystem['datagrid-jgroups'])) {
          this.jgroups = response.subsystem['datagrid-jgroups'];
        }
        for (var i in allClusters) {
          if (i !== undefined) {
            this.clusters.push(allClusters[i]);
            clusterPromises.push(allClusters[i].refresh());
          }
        }
        return $q.all(clusterPromises);
      }.bind(this));
    };

    Profile.prototype.getClusters = function () {
      return this.clusters;
    };

    Profile.prototype.getEndpoints = function () {
      return this.endpoints;
    };

    Profile.prototype.getJGroups = function () {
      return this.jgroups;
    };

    return Profile;
  }
]);
