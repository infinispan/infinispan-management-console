'use strict';

angular.module('managementConsole')
  .controller('editContainerTransportCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    'modelController',
    'cacheContainerConfigurationService',
    function ($scope, $state, $stateParams, utils, modelController, cacheContainerConfigurationService) {
      if (!$stateParams.clusterName) {
        $state.go('error404');
      }

      $scope.currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);

      $scope.transports = ['default','undefined']; //TODO where to get available transports
      $scope.transport = $scope.currentCluster.getTransportConfiguration();

      $scope.saveTransport = function(){
        var address = $scope.currentCluster.getResourcePath().concat('transport','TRANSPORT');
        cacheContainerConfigurationService.saveTransport(address, $scope.transport);
      };

      $scope.backToClusterView = function(){
        $state.go('clusterView',{'clusterName': $scope.currentCluster.name});
      }

    }]);
