'use strict';

angular.module('managementConsole')
  .controller('editContainerTransportCtrl', [
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

      $scope.transports = ['default','undefined']; //TODO where to get available transports
      $scope.transport = $scope.currentCluster.getTransportConfiguration();

      $scope.saveTransport = function(){
        var address = $scope.currentCluster.getResourcePath().concat('transport','TRANSPORT');
        modelController.writeAttribute(address,'channel', $scope.transport.channel);
        modelController.writeAttribute(address,'lock-timeout', $scope.transport['lock-timeout']);
        modelController.writeAttribute(address,'strict-peer-to-peer', $scope.transport['strict-peer-to-peer']);
      };

    }]);
