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

      function getChannelName(clusterName) {
        var address = ['profile', clusterName, 'subsystem', 'datagrid-jgroups'];
        return modelController.readChildrenNames(address, 'channel');
      }

      function getView(hostName, serverName, clusterName) {
        return getChannelName(clusterName).then(function (channelName){
          var address = ['host', hostName, 'server', serverName, 'subsystem', 'datagrid-jgroups',
            'channel', channelName[0], 'protocol', 'pbcast.GMS'];
          return modelController.readAttribute(address, 'view').then(function(view){
            var lastIndex = view.indexOf('|');
            var hostServerSplitIndex = view.indexOf(':');
            return {
              host: view.substring(1,hostServerSplitIndex),
              server: view.substring(hostServerSplitIndex + 1,lastIndex)
            };
          });
        });
      }

      return {
        stopCluster:stopCluster,
        startCluster:startCluster,
        restartCluster:restartCluster,
        reloadCluster:reloadCluster,
        getView:getView
      };
    }
  ]);
