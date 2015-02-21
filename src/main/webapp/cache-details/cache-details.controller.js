'use strict';

angular.module('managementConsole')
    .controller('CacheDetailsCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'modelController',
    function ($scope, $stateParams, $state, modelController) {
            if (!modelController.isAuthenticated()) {
                $state.go('/logout');
            }
            if (!$stateParams.clusterName && !$stateParams.cacheName) {
                $state.go('error404');
            }
            var server = modelController.getServer();
            var clusters = server.getClusters();
            $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
            $scope.caches = $scope.currentCluster.getCachesNameMap();
            $scope.currentCache = $scope.caches[$stateParams.cacheName];
            $scope.currentCacheStats = {
                'cache-status': '',
                'nodeStats': []
            };
            var p = server.fetchCacheStats($scope.currentCluster, $scope.currentCache);
            p.then(function (response) {
                $scope.currentCacheStats.nodeStats = response;
            });
            
    }]);