'use strict';

angular.module('managementConsole')
  .controller('createCacheCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    'modelController',
    'cacheCreateController',
    function ($scope, $state, $stateParams, utils, modelController, cacheCreateController) {
      //-- Variables --//

      if (!modelController.isAuthenticated()) {
        $state.go('/logout');
      }
      if (!$stateParams.clusterName) {
        $state.go('error404');
      }

      var server = modelController.getServer();
      var clusters = server.getClusters();
      $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
      $scope.newlyCreatedCache = {};
      $scope.selectedCacheType = 'distributed-cache';
      $scope.isCreateEnabled = false;

      $scope.createCache = function () {
        var address = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.name];
        address.push($scope.newlyCreatedCache.type);
        address.push($scope.newlyCreatedCache.name);
        cacheCreateController.createCache(address, $scope.newlyCreatedCache, function () {
          $scope.currentCluster.refresh();
          $state.go('clusterView', {clusterName: $scope.currentCluster.name});
        });
      };

      $scope.$on('createEnabled', function(e, data) {
        $scope.isCreateEnabled = data;
      });

      $scope.$on('createCacheTypeSelected', function(e, data) {
        $scope.selectedCacheType = data;
      });

    }]);
