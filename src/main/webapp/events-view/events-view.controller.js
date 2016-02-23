'use strict';

angular.module('managementConsole')
    .controller('EventsViewCtrl', [
    '$scope',
    'modelController',
    'utils',
    function ($scope, modelController, serverGroups, utils) {
      $scope.clusters = modelController.getServer().getClusters();
      $scope.gridEvents = [];
      $scope.lineCount = 100;
      $scope.allPossibleLineCounts = [100, 500, 1000, 2000, 5000, 10000];

       $scope.refreshClusterEvents = function(cluster, maxLines) {
            cluster.fetchClusterEvents(maxLines).then(
               function (response) {
                  angular.forEach(response, function ( event ) {
                    $scope.gridEvents.push(event);
                    });
               }
            );
       }

      $scope.refreshGridEvents = function() {
          $scope.gridEvents = [];
           angular.forEach($scope.clusters, function(cluster){
             $scope.refreshClusterEvents(cluster, $scope.lineCount);
          });
      }

      // Refresh grid events
      $scope.refreshGridEvents();
  }]);
