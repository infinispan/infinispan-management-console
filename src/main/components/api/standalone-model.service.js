'use strict';

angular.module('managementConsole.api')
  .factory('StandaloneModel', [
    'ClusterModel',
    'NodeModel',
    function (ClusterModel, NodeModel) {
      var Standalone = function(modelController, info) {
        this.modelController = modelController;
        this.lastRefresh = null;
        this.info = info;
        this.name = this.info.name;
      };

      Standalone.prototype.getModelController = function() {
        return this.modelController;
      };

      Standalone.prototype.getResourcePath = function() {
        return [];
      };

      Standalone.prototype.refresh = function(callback) {
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

      Standalone.prototype.getClusters = function() {
        var clusters = [];
        for(var name in this.data['cache-container']) {
          if (name !== undefined) {
            clusters.push(new ClusterModel(this, name));
          }
        }
        return clusters;
      };
      
      Standalone.prototype.getNodes = function() {
        var nodes = [];
        nodes.push(new NodeModel(null, this.info.name, this.getModelController()));
        return nodes;
      };

      return Standalone;
    }
  ]);
