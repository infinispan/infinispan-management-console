'use strict';

angular.module('managementConsole')
  .controller('NodeStatusCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$interval',
    '$modal',
    'modelController',
    'utils',
    function ($scope, $stateParams, $state, $interval, $modal, modelController, utils) {

      $scope.clusterName = $stateParams.clusterName;
      $scope.nodeName = $stateParams.nodeName;


      var controller = modelController.getServer();
      $scope.serverNode = controller.getNode($stateParams.nodeName);


      $scope.dataPoints = [];
      $scope.dataColumns = [
        {'id': 'd1', 'type': 'donut', 'name': 'Used'},
        {'id': 'd2', 'type': 'donut', 'name': 'Free'}
      ];

      $scope.fetchStats = function (){
        $scope.serverNode.fetchStats().then(function (response) {
          //memory
          var memory = response.memory['heap-memory-usage'];
          var used = (memory.used / 1024) / 1024;
          var max = (memory.max / 1024) / 1024;

          $scope.dataPoints = [{'d1': used}, {'d2': max}];

          //threading
          var threading = response.threading;
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
      };


      $scope.refresh = function (){
        $scope.serverNode.refresh();
        $scope.serverNode.refreshState();
        $scope.serverNode.fetchAggregateNodeStats().then(function (response) {
          //TODO here we need to loop through all cache containers and add all stats up
          //but for now just use the first container found
          var containersRoot = response['cache-container'];
          for (var prop in containersRoot) {
            $scope.nodeStats = containersRoot[prop];
            break;
          }
        });
        $scope.fetchStats();
      };

      $interval(function(){
        $scope.refresh();
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

      $scope.startNode = function () {
        $scope.serverNode.start();
      };

      $scope.stopNode = function () {
        $scope.serverNode.stop();
      };

      var NodeModalInstanceCtrl = function ($scope, utils, $modalInstance, $stateParams) {

        $scope.serverNode = $stateParams.nodeName;
        $scope.clusterName = $stateParams.clusterName;

        $scope.cancelModal = function () {
          $modalInstance.dismiss('cancel');
        };

      };

      $scope.openModal = function (mode) {
        $scope.mode = mode;
        $modal.open({
          templateUrl: 'node-status/confirmation-node-modal.html',
          controller: NodeModalInstanceCtrl,
          scope: $scope
        });
      };

    }]);



