'use strict';

angular.module('managementConsole')
  .factory('taskService', [
    '$q',
    'modelController',
    'clusterNodesService',
    'utils',
    function ($q, modelController, clusterNodesService, utils) {

      function getTaskHistory(cluster, maxLines) {
        return clusterNodesService.getCoordinator(cluster).then(function (coord) {
          var resourcePathCacheContainer = coord.getResourcePath()
            .concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.getName());

          var op = {
            'operation': 'read-event-log',
            'address': resourcePathCacheContainer,
            'lines': maxLines,
            'category': 'TASKS'
          };

          return modelController.execute(op);
        });
      }

      // Refresh running tasks
      function getRunningTasks(cluster) {
        return clusterNodesService.getCoordinator(cluster).then(function (coord) {
          var resourcePathCacheContainer = coord.getResourcePath()
            .concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.getName());

          var op = {
            'operation': 'task-status',
            'address': resourcePathCacheContainer
          };

          return modelController.execute(op);
        });
      }

      // Load tasks
      function loadTasks(cluster) {
        return clusterNodesService.getCoordinator(cluster).then(function (coord) {
          var resourcePathCacheContainer = coord.getResourcePath()
            .concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.getName());

          var op = {
            'operation': 'task-list',
            'address': resourcePathCacheContainer
          };

          return modelController.execute(op);
        });
      }

      function executeTask(cluster, server, taskName, cacheName, async, params) {
        var resourcePathCacheContainer = server.getResourcePath()
          .concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.getName());

        var paramMap = {};
        params.forEach(function (param) {
          if (utils.isNotNullOrUndefined(param.name) && utils.isNonEmptyString(param.name)) {
            paramMap[param.name] = param.value;
          }
        });

        var op = {
          'operation': 'task-execute',
          'address': resourcePathCacheContainer,
          'name': taskName,
          'cache-name': cacheName,
          'async': async,
          parameters: paramMap
        };
        return modelController.execute(op);
      }


      return {
        getTaskHistory: getTaskHistory,
        getRunningTasks: getRunningTasks,
        loadTasks: loadTasks,
        executeTask: executeTask
      };
    }
  ]);
