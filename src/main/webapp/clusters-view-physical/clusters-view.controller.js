'use strict';

angular.module('managementConsole')
    .controller('ClustersViewPhysicalCtrl', [
    '$scope',
    'modelController',
    'serverGroups',
    'clusterEventsService',
    function ($scope, modelController, serverGroups, clusterEventsService) {
           $scope.groups = serverGroups;
           $scope.servers = modelController.getServer().getNodes();

           $scope.clusters = modelController.getServer().getClusters();
           $scope.gridEvents = [];

            // Loads latest grid events
           $scope.refreshClusterEvents = function(cluster, maxLines) {
             clusterEventsService.fetchClusterEvents(cluster, maxLines).then(function (response) {
                 angular.forEach(response, function (event) {
                   $scope.gridEvents.push(event);
                 });
               }
             );
           };

          $scope.refreshGridEvents = function() {
                $scope.gridEvents = [];
                angular.forEach($scope.clusters, function(cluster){
                  $scope.refreshClusterEvents(cluster, 10);
                });
          };

          // Refresh grid events
          $scope.refreshGridEvents();
  }]);
