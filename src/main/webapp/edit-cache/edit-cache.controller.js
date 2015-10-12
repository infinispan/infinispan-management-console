'use strict';

angular.module('managementConsole')
  .controller('editCacheCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    'modelController',
    function ($scope, $state, $stateParams, utils, modelController) {
      //-- Variables --//

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

      $scope.currentCacheMode = utils.getCacheMode($scope.currentCache);


      $scope.saveCache = function (){
          var address = ['profile', 'clustered', 'subsystem', 'infinispan', 'cache-container', $scope.currentCluster.name];
          address.push($scope.newlyCreatedCache.type);
          address.push($scope.newlyCreatedCache.name);
          //save changes
      };


    }]);
