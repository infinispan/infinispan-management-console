'use strict';

angular.module('managementConsole')
  .factory('clusterEventsService', [
    '$q',
    'modelController',
    'clusterNodesService',
    function ($q, modelController, clusterNodesService) {


      function fetchClusterEvents(cluster, maxLines){
        return clusterNodesService.getCoordinator(cluster).then(function(coord){
          var resourcePathCacheContainer = coord.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.getName());
          var op = {
            'operation': 'read-event-log',
            'address': resourcePathCacheContainer,
            "lines": maxLines
          };
          return modelController.execute(op);
        });
      }

      return {
        fetchClusterEvents:fetchClusterEvents
      };
    }
  ]);
