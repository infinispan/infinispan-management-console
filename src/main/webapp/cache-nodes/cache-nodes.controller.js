'use strict';

angular.module('managementConsole')
    .controller('CacheNodesCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'modelController',
    'utils',
    function ($scope, $stateParams, $state, modelController, utils) {
            if (!$stateParams.clusterName && !$stateParams.cacheName) {
                $state.go('error404');
            }
            var server = modelController.getServer();
            var clusters = server.getClusters();
            $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
            $scope.caches = $scope.currentCluster.getCaches();
            $scope.currentCache = $scope.caches[$stateParams.cacheName];
            $scope.currentCache.refresh();
            $scope.currentCacheStats = {};
            var p = server.fetchCacheStats($scope.currentCluster, $scope.currentCache);
            p.then(function (response) {
                $scope.currentCacheStats.nodeStats = response;
            });
            $scope.currentCacheAvailability = function () {
              return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
            };
    }]);
