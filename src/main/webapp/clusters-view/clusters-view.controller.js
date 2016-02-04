'use strict';

angular.module('managementConsole')
    .controller('ClustersViewCtrl', [
    '$scope',
    '$state',
    'modelController',
    'utils',
    function ($scope, $state, modelController, utils) {

            $scope.clusters = modelController.getServer().getClusters();
            $scope.group = modelController.getServer().getServerGroupName();
            $scope.stack = modelController.getServer().getFirstServer().getDefaultStack();
            $scope.relays = {};
            $scope.offlineSites = {};
            $scope.onlineSites  = {};
            $scope.mixedSites   = {};

            //
            // Updates the map of remote site status
            //
            $scope.refreshRemoteSitesStatus = function(cluster) {
              var resourcePathCacheContainer = cluster.domain.getFirstServer().getResourcePath()
                 .concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.name);

                // Refresh list of offline sites
                cluster.modelController.readAttribute(resourcePathCacheContainer, 'sites-offline').then(
                  function (response){
                      if( response != null && response.constructor === Array) {
                        $scope.offlineSites[cluster.name] = response
                      } else {
                        $scope.offlineSites[cluster.name] = [];
                      }
                  }
                );

                // Refresh list of online sites
                cluster.modelController.readAttribute(resourcePathCacheContainer, 'sites-online').then(
                  function (response){
                      if( response != null && response.constructor === Array) {
                        $scope.onlineSites[cluster.name] = response
                      } else {
                        $scope.onlineSites[cluster.name] = [];
                      }
                  }
                );

                // Refresh list of mixed sites
                cluster.modelController.readAttribute(resourcePathCacheContainer, 'sites-mixed').then(
                  function (response){
                    if( response != null && response.constructor === Array) {
                      $scope.mixedSites[cluster.name] = response
                    } else {
                      $scope.mixedSites[cluster.name] = [];
                    }
                  }
               );
            };


            //endpoints for each cache container
            $scope.endpoints = [];

            angular.forEach($scope.clusters, function(cluster){

              // Update remote site status for cluster
              $scope.refreshRemoteSitesStatus(cluster);

              var relays = cluster.getRelays();
              if (utils.isNonEmptyArray(relays)){
                angular.forEach(relays, function (relay){
                  var tempRelays = relay['remote-site'];
                  $scope.relays[cluster.name] = Object.keys(tempRelays);
                });
              } else {
                $scope.relays[cluster.name] = ['N/A'];
              }
              $scope.endpoints.push(cluster.getEndpoints());
            });
  }]);
