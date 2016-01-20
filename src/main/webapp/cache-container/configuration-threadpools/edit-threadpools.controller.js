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

      $scope.threadpool = $scope.currentCluster.getThreadpoolConfiguration();

      $scope.saveGeneric = function(resourceName){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool',resourceName);
        modelController.writeAttribute(address,'max-threads', $scope.threadpool[resourceName]['max-threads']);
        modelController.writeAttribute(address,'min-threads', $scope.threadpool[resourceName]['min-threads']);
        modelController.writeAttribute(address,'queue-length', $scope.threadpool[resourceName]['queue-length']);
        modelController.writeAttribute(address,'keepalive-time', $scope.threadpool[resourceName]['keepalive-time']);
      };

      $scope.saveAsync = function(){
        $scope.saveGeneric('async-operations');
      };

      $scope.saveExpiration = function(){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool','expiration');
        modelController.writeAttribute(address,'max-threads', $scope.threadpool.expiration['max-threads']);
        modelController.writeAttribute(address,'keepalive-time', $scope.threadpool.expiration['keepalive-time']);
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
        modelController.writeAttribute(address,'max-threads', $scope.threadpool['replication-queue']['max-threads']);
        modelController.writeAttribute(address,'keepalive-time', $scope.threadpool['replication-queue']['keepalive-time']);
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
