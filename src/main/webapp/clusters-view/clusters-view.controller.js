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
            //endpoints for each cache container
            $scope.endpoints = [];
            angular.forEach($scope.clusters, function(cluster, key){
              var relays = cluster.getRelays();
              if (utils.isNonEmptyArray(relays)){
                angular.forEach(relays, function (relay, key){
                  var tempRelays = relay['remote-site'];
                  $scope.relays[cluster.name] = Object.keys(tempRelays);
                });
              } else {
                $scope.relays[cluster.name] = ['N/A'];
              }
              $scope.endpoints.push(cluster.getEndpoints());
            });
  }]);
