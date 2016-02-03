'use strict';

angular.module('managementConsole')
  .controller('editContainerThreadpoolsCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheContainerConfigurationService',
    function ($scope, $state, $stateParams, utils, $modal, modelController, cacheContainerConfigurationService) {
      if (!$stateParams.clusterName) {
        $state.go('error404');
      }

      var RequiresRestartModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
          $modalInstance.close(true);
        };

        $scope.cancel = function () {
          $modalInstance.dismiss();
        };
      };

      $scope.currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);
      $scope.threadpool = $scope.currentCluster.getThreadpoolConfiguration();

      $scope.metadata = $scope.currentCluster.getMetadata().children['thread-pool']['model-description'];
      $scope.directiveHandle = {};

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

      $scope.executeSave = function(){
        $scope.saveGeneric('async-operations');
        $scope.saveGeneric('listener');
        $scope.saveGeneric('persistence');
        $scope.saveGeneric('remote-command');
        $scope.saveGeneric('state-transfer');
        $scope.saveGeneric('transport');
        $scope.saveExpiration();
        $scope.saveReplicationQueue();
      };

      $scope.save = function (){
        var rr = $scope.directiveHandle.requiresRestart();
        if(rr){
          var dialog = $modal.open({
            templateUrl: 'components/dialogs/requires-restart.html',
            controller: RequiresRestartModalInstanceCtrl,
            scope: $scope
          });

          dialog.result.then(function (requiresRestart) {
            if (requiresRestart){
               $scope.executeSave();
            }
          }, function () {});
        } else {
          $scope.executeSave();
        }
      };

      $scope.cancel = function(){
        $state.go('clusterView',{'clusterName': $scope.currentCluster.name});
      }

    }]);
