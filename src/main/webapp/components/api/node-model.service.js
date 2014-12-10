'use strict';

angular.module('managementConsole.api')
  .factory('NodeModel', [
    function () {
      /**
       * Represents a Node
       */
      var Node = function(host, server, modelController) {
        this.host = host;
        this.server = server;
        this.name = (server === null) ? host : host + '/' + server;
        this.modelController = modelController;
        this.lastRefresh = null;
      };

      Node.prototype.refresh = function() {};

      return Node;
    }
  ]);
