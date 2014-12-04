'use strict';

angular.module('managementConsole.api')
  .factory('DomainModel', [
    'ClusterModel',
    'NodeModel',
    function (ClusterModel, NodeModel) {
      var Domain = function(modelController, info) {
        this.modelController = modelController;
        this.lastRefresh = null;
        this.info = info;
        this.name = this.info.name;
      };

      Domain.prototype.getModelController = function() {
        return this.modelController;
      };

      Domain.prototype.getResourcePath = function() {
        return ['host', 'master', 'server', 'server-one'];
      };

      Domain.prototype.refresh = function(callback) {
        this.modelController.readResource(this.getResourcePath().concat(
            'subsystem', 'infinispan', 'cache-container'), false, false, function(response) {
          this.name = response.name;
          this.data = response;
          this.lastRefresh = new Date();
          if (callback) {
            callback(this);
          }
        }.bind(this));
      };

      Domain.prototype.getClusters = function() {
        var clusters = [];
        for(var name in this.data['cache-container']) {
          if (name !== undefined) {
            clusters.push(new ClusterModel(this, name));
          }
        }
        return clusters;
      };
      
      Domain.prototype.getNodes = function() {
        var nodes = [];
        nodes.push(new NodeModel(null, this.info.name, this.getModelController()));
        return nodes;
      };

      return Domain;
    }
  ]);
