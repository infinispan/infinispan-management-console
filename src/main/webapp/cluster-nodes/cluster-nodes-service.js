'use strict';

angular.module('managementConsole')
  .factory('clusterNodesService', [
    '$q',
    'modelController',
    function ($q, modelController) {

      function restartCluster() {
        var cluster = modelController.getServer().getServerGroup();
        return cluster.restartServers();
      }

      function startCluster() {
        var cluster = modelController.getServer().getServerGroup();
        return cluster.startServers();
      }

      function stopCluster() {
        var cluster = modelController.getServer().getServerGroup();
        return cluster.stopServers();
      }

      function reloadCluster() {
        var cluster = modelController.getServer().getServerGroup();
        return cluster.reloadServers();
      }

      function getChannelName(clusterName) {
        var address = ['profile', clusterName, 'subsystem', 'datagrid-jgroups'];
        return modelController.readChildrenNames(address, 'channel');
      }

      function getView(hostName, serverName, clusterName) {
        return getChannelName(clusterName).then(function (channelName) {
          var address = ['host', hostName, 'server', serverName, 'subsystem', 'datagrid-jgroups',
            'channel', channelName[0], 'protocol', 'pbcast.GMS'];

          return modelController.readAttribute(address, 'view').then(function (view) {
            var lastIndex = view.indexOf('|');
            var hostServerSplitIndex = view.indexOf(':');
            return {
              host: view.substring(1, hostServerSplitIndex),
              server: view.substring(hostServerSplitIndex + 1, lastIndex)
            };
          }).catch(function (e) {
            return {
              host: '',
              server: ''
            };
          });
        });
      }

      function getCoordinator(cluster) {
        var servers = cluster.getNodes();
        var firstServer = servers[0]; //lets ask first server
        return getChannelName(cluster.getName()).then(function (channelName) {
          var address = ['host', firstServer.getHost(), 'server', firstServer.getServerName(), 'subsystem', 'datagrid-jgroups',
            'channel', channelName[0], 'protocol', 'pbcast.GMS'];

          return modelController.readAttribute(address, 'view').then(function (view) {
            var lastIndex = view.indexOf('|');
            var hostServerSplitIndex = view.indexOf(':');
            var host = view.substring(1, hostServerSplitIndex);
            var server = view.substring(hostServerSplitIndex + 1, lastIndex);

            var serverIndex = -1; // not found
            var foundCoordinator = servers.some(function(entry, index) {
              if (entry.getHost() === host && entry.getServerName() === server) {
                serverIndex = index;
                return true;
              }
            });
            if (foundCoordinator){
              return servers[serverIndex];
            } else {
              return servers[0];
            }

          }).catch(function (e) {
            return servers [0];
          });
        });
      }

      return {
        stopCluster:stopCluster,
        startCluster:startCluster,
        restartCluster:restartCluster,
        reloadCluster:reloadCluster,
        getView:getView,
        getCoordinator:getCoordinator
      };
    }
  ]);
