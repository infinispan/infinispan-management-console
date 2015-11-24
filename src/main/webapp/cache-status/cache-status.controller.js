'use strict';

angular.module('managementConsole')
    .controller('CacheStatusCtrl', [
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

            $scope.matchHeight = function () {
              utils.matchHeight(document, '.card-pf');
            };

            $scope.currentCacheType = function () {
              return utils.getCacheType($scope.currentCache);
            };

            $scope.currentCacheMode = utils.getCacheMode($scope.currentCache);

            $scope.currentCacheNumOwners = function () {
              return $scope.currentCache.isDistributed() &&
              utils.isNotNullOrUndefined($scope.currentCache.configuration.owners) ? $scope.currentCache.configuration.owners + ' owners' : '';
            };

    }]);
