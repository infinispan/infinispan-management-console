'use strict';

angular.module('managementConsole')
    .controller('CacheStatusCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'modelController',
    'utils',
    function ($scope, $stateParams, $state, modelController, utils) {
            if (!modelController.isAuthenticated()) {
                $state.go('/logout');
            }
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
            var p = server.fetchCacheStats($scope.currentCluster, $scope.currentCache);
            p.then(function (response) {
                $scope.currentCacheStats.nodeStats = response;
                $scope.currentCacheStats.firstServerStats = response[0];
            });

            $scope.currentCacheAvailability = function () {
              return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
            };

            $scope.currentCacheType = function () {
              var cacheType = 'Distributed';
              if ($scope.currentCache.isReplicated()){
                cacheType = 'Replicated';
              }
              else if ($scope.currentCache.isInvalidation()){
                cacheType = 'Invalidation';
              }
              else if ($scope.currentCache.isLocal()){
                cacheType = 'Local';
              }
              return cacheType;
            };

            $scope.currentCacheMode = $scope.currentCache.configuration.mode === 'SYNC'? 'Sync':'Async';

            $scope.currentCacheNumOwners = function () {
              return $scope.currentCache.isDistributed() &&
              utils.isNotNullOrUndefined($scope.currentCache.configuration.owners) ? $scope.currentCache.configuration.owners + ' owners' : '';
            };

    }]);
