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

      $scope.metadata = $scope.currentCluster.getMetadata().children['thread-pool']['model-description'];

      $scope.saveGeneric = function(resourceName){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool',resourceName);
        cacheContainerConfigurationService.writeGenericThreadpool(address, $scope.threadpool[resourceName]);
      };

      $scope.saveExpiration = function(){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool','expiration');
        cacheContainerConfigurationService.writeThreadPool(address, $scope.threadpool['expiration']);
      };


      $scope.saveReplicationQueue = function(){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool','replication-queue');
        cacheContainerConfigurationService.writeThreadPool(address, $scope.threadpool['replication-queue']);
      };

      $scope.save = function(){
        $scope.saveGeneric('async-operations');
        $scope.saveGeneric('listener');
        $scope.saveGeneric('persistence');
        $scope.saveGeneric('remote-command');
        $scope.saveGeneric('state-transfer');
        $scope.saveGeneric('transport');
        $scope.saveExpiration();
        $scope.saveReplicationQueue();
      };

      $scope.cancel = function(){
        $state.go('clusterView',{'clusterName': $scope.currentCluster.name});
      }

    }]);
