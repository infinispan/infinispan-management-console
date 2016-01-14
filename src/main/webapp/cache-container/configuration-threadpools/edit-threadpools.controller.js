'use strict';

angular.module('managementConsole')
  .controller('editContainerThreadpoolsCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    'modelController',
    function ($scope, $state, $stateParams, utils, modelController) {
      if (!$stateParams.clusterName && !$stateParams.cacheName) {
        $state.go('error404');
      }
      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);
    }]);
