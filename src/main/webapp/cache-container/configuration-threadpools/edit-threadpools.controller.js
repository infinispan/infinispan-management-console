'use strict';

angular.module('managementConsole')
  .controller('editContainerThreadpoolsCtrl', [
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
      $scope.threadpool = $scope.currentCluster.getThreadpoolConfiguration();

      $scope.saveGeneric = function(resourceName){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool',resourceName);
        cacheContainerConfigurationService.writeGenericThreadpool(address, $scope.threadpool[resourceName]);
      };

      $scope.saveAsync = function(){
        $scope.saveGeneric('async-operations');
      };

      $scope.saveExpiration = function(){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool','expiration');
        cacheContainerConfigurationService.writeThreadPool(address, $scope.threadpool['expiration']);
      };

      $scope.saveListener = function(){
        $scope.saveGeneric('listener');
      };

      $scope.savePersistence = function(){
        $scope.saveGeneric('persistence');
      };

      $scope.saveRemoteCommands = function(){
        $scope.saveGeneric('remote-command');
      };

      $scope.saveReplicationQueue = function(){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool','replication-queue');
        cacheContainerConfigurationService.writeThreadPool(address, $scope.threadpool['replication-queue']);
      };

      $scope.saveStateTransfer = function(){
        $scope.saveGeneric('state-transfer');
      };

      $scope.saveTransport = function(){
        $scope.saveGeneric('transport');
      };

      $scope.backToClusterView = function(){
        $state.go('clusterView',{'clusterName': $scope.currentCluster.name});
      }

    }]);
