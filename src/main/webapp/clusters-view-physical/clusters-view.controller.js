'use strict';

angular.module('managementConsole')
    .controller('ClustersViewPhysicalCtrl', [
    '$scope',
    '$state',
    'modelController',
    'utils',
    function ($scope, $state, modelController, utils) {

            $scope.groups = modelController.getServer().getServerGroups();
            $scope.servers = modelController.getServer().getNodes();

            angular.forEach($scope.groups, function(cluster, key){
              cluster.status = 'STOPPED';
              cluster.hostCount = 0;
              cluster.nodeCount = 0;
              var hosts = [];
              angular.forEach($scope.servers, function(server, key){
                if (server.getGroup() === cluster.name) {
                  hosts.push(server.host);
                  if (!server.isRunning()){
                    cluster.status = 'DEGRADED';
                  }
                }
              });
              var hosts = utils.countOccurrences(hosts);
              cluster.hostCount = hosts.length;
              angular.forEach(hosts, function(host, key) {
                cluster.nodeCount += host.count;
              });

              if (cluster.nodeCount > 0 && cluster.status != 'DEGRADED'){
                cluster.status = 'STARTED';
              }
            });
  }]);
