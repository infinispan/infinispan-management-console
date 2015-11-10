'use strict';

angular.module('managementConsole')
  .controller('NodeStatusCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$interval',
    'modelController',
    'utils',
    function ($scope, $stateParams, $state, $interval, modelController, utils) {

      $scope.clusterName = $stateParams.clusterName;
      $scope.nodeName = $stateParams.nodeName;
      $scope.inetAddress = $stateParams.inetAddress;


      var controller = modelController.getServer();
      var serverNode = controller.getNode($stateParams.nodeName);
      var p = serverNode.fetchAggregateNodeStatsByClusterName("clustered", $scope.currentNode);
      p.then(function (response) {
        $scope.nodeStats = response;
        console.log(response);
      });


      $scope.dataPoints = [];
      $scope.dataColumns = [
        {"id": "d1", "type": "donut", "name": "Used"},
        {"id": "d2", "type": "donut", "name": "Free"}
      ];

      $interval(function(){
        serverNode.fetchStats().then(function (response) {
          //memory
          var memory = response['memory']['heap-memory-usage'];
          var used = (memory.used / 1024) / 1024;
          var max = (memory.max / 1024) / 1024;

          $scope.dataPoints = [{"d1": used}, {"d2": max}];

          //threading

          var threading = response['threading'];
          $scope.threadCount = threading['thread-count'];
          $scope.threadPeakCount = threading['peak-thread-count'];
          $scope.threadDaemonCount = threading['daemon-thread-count'];

          var directBufferPool = utils.deepGet(response, 'buffer-pool.name.direct');
          var mappedBufferPool = utils.deepGet(response,'buffer-pool.name.mapped');

          $scope.directBufferPoolCount =  directBufferPool.count;
          $scope.directBufferPoolMemoryUsed= directBufferPool['memory-used'];

          $scope.mappedBufferPoolCount =  mappedBufferPool.count;
          $scope.mappedBufferPoolMemoryUsed= mappedBufferPool['memory-used'];

        });
      }, 500, 1);


      $scope.currentCacheAvailability = function () {
        return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
      };

      $scope.currentCacheType = function () {
        return utils.getCacheType($scope.currentCache);
      };

      $scope.currentCacheNumOwners = function () {
        return $scope.currentCache.isDistributed() &&
        utils.isNotNullOrUndefined($scope.currentCache.configuration.owners) ? $scope.currentCache.configuration.owners + ' owners' : '';
      };

      $scope.suspendNode = function () {
        serverNode.suspend();
      };

      $scope.resumeNode = function () {
        serverNode.resume();
      };

      $scope.restartNode = function () {
        serverNode.restart();
      };

      $scope.serverNodeAvailable = function (){
        return serverNode.isRunning();
      };

    }]);
