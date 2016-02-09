'use strict';

angular.module('managementConsole')
    .controller('CacheStatusCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$modal',
    'modelController',
    'utils',
    function ($scope, $stateParams, $state, $modal, modelController, utils) {
            if (!$stateParams.clusterName && !$stateParams.cacheName) {
                $state.go('error404');
            }
            var server = modelController.getServer();
            var clusters = server.getClusters();
            $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
            $scope.caches = $scope.currentCluster.getCaches();
            $scope.currentCache = $scope.caches[$stateParams.cacheName];
            $scope.currentCache.refresh();
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
              $scope.currentCache.enable();
            };

            $scope.disable = function () {
              $scope.currentCache.disable();
            };

            $scope.purge = function () {
              $scope.currentCache.flush();
            };

            $scope.resetStats = function () {
              $scope.currentCache.resetStats();
            };

            $scope.currentCacheType = function () {
              return utils.getCacheType($scope.currentCache);
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
