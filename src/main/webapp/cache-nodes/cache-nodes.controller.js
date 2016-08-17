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
        $scope.currentCacheAvailability = function () {
            return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
        };
        $scope.refresh = function () {
            var server = modelController.getServer();
            var clusters = server.getClusters();
            $scope.currentCluster = server.getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
            $scope.caches = $scope.currentCluster.getCaches();
            $scope.currentCache = $scope.caches[$stateParams.cacheName];
            $scope.currentCache.refresh();
            $scope.currentCacheStats = {};
            var p = server.fetchCacheStats($scope.currentCluster, $scope.currentCache);
            p.then(function (response) {
                $scope.currentCacheStats.nodeStats = response;
            });
        };
        $scope.refresh();
        $scope.currentClusterAvailabilityAsString = function () {
            return utils.clusterAvailability($scope.currentCluster);
        };
    }]);
//# sourceMappingURL=cache-nodes.controller.js.map