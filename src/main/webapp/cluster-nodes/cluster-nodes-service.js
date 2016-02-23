'use strict';

angular.module('managementConsole')
  .factory('clusterNodesService', [
    '$q',
    'modelController',
    function ($q, modelController) {

      function restartCluster() {
        var cluster = modelController.getServer().getServerGroup();
        cluster.restartServers();
      }

      function startCluster() {
        var cluster = modelController.getServer().getServerGroup();
        cluster.startServers();
      }

      function stopCluster() {
        var cluster = modelController.getServer().getServerGroup();
        cluster.stopServers();
      }

      function reloadCluster() {
        var cluster = modelController.getServer().getServerGroup();
        cluster.reloadServers();
      }

      return {
        stopCluster:stopCluster,
        startCluster:startCluster,
        restartCluster:restartCluster,
        reloadCluster:reloadCluster
      };
    }
  ]);
