'use strict';

angular.module('managementConsole')
  .controller('NodeStatusCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'modelController',
    'utils',
    function ($scope, $stateParams, $state, modelController, utils) {

      $scope.clusterName = $stateParams.clusterName;
      $scope.nodeName = $stateParams.nodeName;
      $scope.inetAddress = $stateParams.inetAddress;


      /*var server = modelController.getServer();
      var clusters = server.getClusters();

      $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);

      $scope.currentNode = server.getNode($stateParams.nodeName);
      $scope.currentNodeStats = {
        'cache-status': '',
        'cacheStats': [],
        'containerStats': []
      };*/

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

    }]);
