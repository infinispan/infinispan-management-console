'use strict';

angular.module('managementConsole')
    .controller('ClustersViewCtrl', [
    '$scope',
    '$state',
    'modelController',
    'clusterEventsService',
    'clusterNodesService',
    'utils',
    function ($scope, $state, modelController, clusterEventsService, clusterNodesService, utils) {

            $scope.clusters = modelController.getServer().getClusters();
            $scope.group = modelController.getServer().getServerGroupName();
            $scope.stack = modelController.getServer().getFirstServer().getDefaultStack();
            $scope.relays = {};
            $scope.offlineSites = {};
            $scope.onlineSites  = {};
            $scope.mixedSites   = {};

            //endpoints for each cache container
            $scope.endpoints = [];


            //
            // Updates the map of remote site status
            //
            $scope.refreshRemoteSitesStatus = function (cluster) {
              clusterNodesService.getCoordinator(cluster).then(function (coord) {
                var address = coord.getResourcePath()
                  .concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.getName());

                // Refresh list of offline sites
                modelController.readAttribute(address, 'sites-offline').then(
                  function (response) {
                    if (utils.isNonEmptyArray(response)) {
                      $scope.offlineSites[cluster.getName()] = response
                    } else {
                      $scope.offlineSites[cluster.getName()] = [];
                    }
                  }
                );

                // Refresh list of online sites
                modelController.readAttribute(address, 'sites-online').then(
                  function (response) {
                    if (utils.isNonEmptyArray(response)) {
                      $scope.onlineSites[cluster.getName()] = response
                    } else {
                      $scope.onlineSites[cluster.getName()] = [];
                    }
                  }
                );

                // Refresh list of mixed sites
                modelController.readAttribute(address, 'sites-mixed').then(
                  function (response) {
                    if (utils.isNonEmptyArray(response)) {
                      $scope.mixedSites[cluster.getName()] = response
                    } else {
                      $scope.mixedSites[cluster.getName()] = [];
                    }
                  }
                );
              });
            };


            //
            // Loads latest grid events
            //
            $scope.refreshGridEvents = function () {
              $scope.gridEvents = [];
              angular.forEach($scope.clusters, function (cluster) {
                $scope.refreshClusterEvents(cluster, 10);
              });
            };

            $scope.refreshClusterEvents = function (cluster, maxLines) {
              clusterEventsService.fetchClusterEvents(cluster, maxLines).then(function (response) {
                  angular.forEach(response, function (event) {
                    $scope.gridEvents.push(event);
                  });
                }
              );
            };

            angular.forEach($scope.clusters, function(cluster){

              // Update remote site status for cluster
              $scope.refreshRemoteSitesStatus(cluster);

              var relays = cluster.getRelays();
              if (utils.isNonEmptyArray(relays)){
                angular.forEach(relays, function (relay){
                  var tempRelays = relay['remote-site'];
                  $scope.relays[cluster.getName()] = Object.keys(tempRelays);
                });
              } else {
                $scope.relays[cluster.getName()] = ['N/A'];
              }
              $scope.endpoints.push(cluster.getEndpoints());
            });

            // Refresh grid events
            $scope.refreshGridEvents();
  }]);
