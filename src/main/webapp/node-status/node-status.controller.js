'use strict';

angular.module('managementConsole')
  .controller('NodeStatusCtrl', [
    '$scope',
    '$stateParams',
    '$modal',
    'modelController',
    'nodeStats',
    'aggregateNodeStats',
    'view',
    'utils',
    function ($scope, $stateParams, $modal, modelController, nodeStats, aggregateNodeStats, view, utils) {

      $scope.clusterName = $stateParams.clusterName;
      $scope.nodeName = $stateParams.nodeName;


      var controller = modelController.getServer();
      $scope.serverNode = controller.getNode($stateParams.nodeName);


      $scope.view = view;
      $scope.dataPoints = [];
      $scope.dataColumns = [
        {'id': 'd1', 'type': 'donut', 'name': 'Used'},
        {'id': 'd2', 'type': 'donut', 'name': 'Free'}
      ];

      $scope.extractAggregateNodeStats = function (aggregateStats) {
        //TODO here we need to loop through all cache containers and add all stats up
        //but for now just use the first container found
        var containersRoot = aggregateStats['cache-container'];
        for (var prop in containersRoot) {
          $scope.nodeStats = containersRoot[prop];
          break;
        }
      };

      $scope.isCoordinator = function (server) {
        return server.getHost() === $scope.view.host && server.getServerName() === $scope.view.server;
      };

      $scope.updateStatsData = function (statsData) {
        //memory
        var memory = statsData.memory['heap-memory-usage'];
        var used = (memory.used / 1024) / 1024;
        var max = (memory.max / 1024) / 1024;

        $scope.dataPoints = [{'d1': used}, {'d2': max}];

        //threading
        var threading = statsData.threading;
        $scope.threadCount = threading['thread-count'];
        $scope.threadPeakCount = threading['peak-thread-count'];
        $scope.threadDaemonCount = threading['daemon-thread-count'];

        var directBufferPool = utils.deepGet(statsData, 'buffer-pool.name.direct');
        var mappedBufferPool = utils.deepGet(statsData,'buffer-pool.name.mapped');

        $scope.directBufferPoolCount =  directBufferPool.count;
        $scope.directBufferPoolMemoryUsed= directBufferPool['memory-used'];

        $scope.mappedBufferPoolCount =  mappedBufferPool.count;
        $scope.mappedBufferPoolMemoryUsed= mappedBufferPool['memory-used'];
      };

      $scope.extractAggregateNodeStats(aggregateNodeStats);
      $scope.updateStatsData(nodeStats);

      $scope.fetchStats = function (){
        $scope.serverNode.fetchStats().then(function (response) {
         $scope.updateStatsData(response);
        });
      };

      $scope.refresh = function (){
        $scope.serverNode.refresh();
        $scope.serverNode.refreshState();
        $scope.serverNode.fetchAggregateNodeStats().then(function (response) {
          $scope.extractAggregateNodeStats(response);
        });
        $scope.fetchStats();
      };

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



