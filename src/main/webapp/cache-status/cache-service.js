'use strict';

angular.module('managementConsole')
  .factory('cacheService', [
    '$q',
    'modelController',
    function ($q, modelController) {

      function start (cache) {
        return executeOp(cache, 'start-cache');
      }

      function stop (cache) {
        return executeOp(cache, 'stop-cache');
      }

      function enable (cache){
        var profile = cache.getCluster().getProfile();
        var endpointAddress = profile.getResourcePath().concat('subsystem','datagrid-infinispan-endpoint');
        var op = {
          'operation': 'unignore-cache-all-endpoints',
          'cache-names':[cache.getName()],
          'address': endpointAddress
        };
        return modelController.execute(op);
      }

      function disable (cache){
        var profile = cache.getCluster().getProfile();
        var endpointAddress = profile.getResourcePath().concat('subsystem','datagrid-infinispan-endpoint');
        var op = {
          'operation': 'ignore-cache-all-endpoints',
          'cache-names':[cache.getName()],
          'address': endpointAddress
        };
        return modelController.execute(op);
      }

      function flush (cache){
        return executeOp(cache, 'flush-cache');
      }

      function resetStats (cache){
        return executeOp(cache, 'reset-statistics');
      }

      function executeOp (cache, operationName){
        var address = cache.getResourcePath();
        var op = {
          'operation': operationName,
          'address': address
        };
        return modelController.execute(op);
      }

      return {
        start: start,
        stop: stop,
        enable: enable,
        disable: disable,
        flush: flush,
        resetStats: resetStats
      };

    }
  ]);
