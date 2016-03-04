'use strict';

angular.module('managementConsole')
    .controller('CacheStatusCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$modal',
    'modelController',
    'clusterNodesService',
    'utils',
    function ($scope, $stateParams, $state, $modal, modelController, clusterNodesService, utils) {
            if (!$stateParams.clusterName && !$stateParams.cacheName) {
                $state.go('error404');
            }
            var server = modelController.getServer();
            var clusters = server.getClusters();
            $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
            $scope.caches = $scope.currentCluster.getCaches();
            $scope.currentCache = $scope.caches[$stateParams.cacheName];
            $scope.currentCache.refresh();

            // User feedback report
            $scope.successExecuteOperation = false;
            $scope.errorExecuting          = false;
            $scope.errorDescription        = null;


            $scope.currentCacheStats = {
                'cacheStatus': '',
                'firstServerStats': []
            };

            $scope.refresh = function (){
              server.fetchCacheStats($scope.currentCluster, $scope.currentCache).then(function (response) {
                $scope.currentCacheStats.nodeStats = response;
                $scope.currentCacheStats.firstServerStats = response[0];
              });
            };

            $scope.refresh();

            $scope.currentCacheAvailability = function () {
              return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
            };

            $scope.currentClusterAvailabilityAsString = function () {
              return utils.clusterAvailability($scope.currentCluster);
            };

            $scope.matchHeight = function () {
              utils.matchHeight(document, '.card-pf');
            };

            $scope.enable = function () {
              $scope.currentCache.enable().then(function (){
                $scope.openInfoModal('Cache ' + $scope.currentCache.getName() + ' has been attached to remote endpoints successfully.');
              }).catch(function (e){
                $scope.openErrorModal(e);
              });
              $scope.refresh();
            };

            $scope.disable = function () {
              $scope.currentCache.disable().then(function (){
                $scope.openInfoModal('Cache ' + $scope.currentCache.getName() + ' has been detached from remote endpoints successfully.');
              }).catch(function (e){
                $scope.openErrorModal(e);
              });
              $scope.refresh();
            };

            $scope.purge = function () {
              $scope.currentCache.flush().then(function (){
                $scope.openInfoModal('Cache ' + $scope.currentCache.getName() + ' has been purged successfully.');
              }).catch(function (e){
                $scope.openErrorModal(e);
              });
              $scope.refresh();
            };

            $scope.resetStats = function () {
              $scope.currentCache.resetStats();
              $scope.refresh();
            };

            $scope.currentCacheType = function () {
              return utils.getCacheType($scope.currentCache);
            };

            // Changes cache rebalancing
            $scope.setCacheRebalance = function (rebalance) {

              clusterNodesService.getCoordinator($scope.currentCluster).then(function (coord) {
                var resourcePathCacheContainer = coord.getResourcePath()
                  .concat('subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.getName(),
                  $scope.currentCache.type,
                  $scope.currentCache.getName()
                );

                var op = {
                  'operation': 'cache-rebalance',
                  'address': resourcePathCacheContainer,
                  'value': rebalance
                };

                $scope.successExecuteOperation = false;
                $scope.errorExecuting = false;

                modelController.execute(op).then(
                  function () {
                    $scope.successExecuteOperation = true;
                    $scope.refresh();
                  },
                  function (reason) {
                    $scope.errorExecuting = true;
                    $scope.errorDescription = reason;
                    $scope.refresh();
                  }
                );
              });
            };

            $scope.currentCacheMode = utils.getCacheMode($scope.currentCache);

            $scope.currentCacheNumOwners = function () {
              return $scope.currentCache.isDistributed() &&
              utils.isNotNullOrUndefined($scope.currentCache.configuration.owners) ? $scope.currentCache.configuration.owners + ' owners' : '';
            };

            $scope.openModal = function (mode) {
              $scope.mode = mode;
              $modal.open({
                templateUrl: 'cache-status/confirmation-cache-modal.html',
                controller: function ($scope, $modalInstance) {

                  $scope.cacheName = $scope.currentCache.name;

                  $scope.cancelModal = function () {
                    $modalInstance.dismiss('cancel');
                  };
                },
                scope: $scope
              });
            };
    }]);
