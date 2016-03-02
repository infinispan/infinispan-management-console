'use strict';

angular.module('managementConsole')
  .controller('editContainerThreadpoolsCtrl', [
    '$scope',
    '$rootScope',
    '$q',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheContainerConfigurationService',
    'clusterNodesService',
    function ($scope, $rootScope, $q, $state, $stateParams, utils, $modal, modelController,
              cacheContainerConfigurationService, clusterNodesService) {
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
      $scope.configurationSectionHandles = []; //assigned to a configuration section through HTML attribute

      $scope.requiresRestart = function (){
        return $scope.configurationSectionHandles.some(function (handle) {
          return handle.requiresRestart();
        });
      };

      $scope.hasDirtyFields = function (){
        return $scope.configurationSectionHandles.some(function (confSection) {
          return confSection.isAnyFieldModified();
        });
      };

      $scope.cleanMetadata = function (){
        $scope.configurationSectionHandles.forEach(function (confSection) {
          confSection.cleanMetadata();
        });
      };

      $scope.saveGeneric = function(resourceName){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool',resourceName);
        return cacheContainerConfigurationService.writeGenericThreadpool(address, $scope.threadpool[resourceName]);
      };

      $scope.saveExpiration = function(){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool','expiration');
        return cacheContainerConfigurationService.writeThreadPool(address, $scope.threadpool['expiration']);
      };


      $scope.saveReplicationQueue = function(){
        var address = $scope.currentCluster.getResourcePath().concat('thread-pool','replication-queue');
        return cacheContainerConfigurationService.writeThreadPool(address, $scope.threadpool['replication-queue']);
      };

      $scope.executeSave = function(){
        return $scope.saveGeneric('async-operations').then(function () {
          $scope.saveGeneric('listener')
        }).then(function () {
          $scope.saveGeneric('persistence')
        }).then(function () {
          $scope.saveGeneric('remote-command')
        }).then(function () {
          $scope.saveGeneric('state-transfer')
        }).then(function () {
          $scope.saveGeneric('transport')
        }).then(function () {
          $scope.saveExpiration();
        }).then(function () {
          $scope.saveReplicationQueue();
        });
      };

      $scope.saveWithoutRestart = function (){
        $scope.executeSave();
      };

      $scope.save = function () {
        if ($scope.hasDirtyFields()) {
          var rr = $scope.requiresRestart();
          if (rr) {
            var dialog = $modal.open({
              templateUrl: 'components/dialogs/requires-restart.html',
              controller: RequiresRestartModalInstanceCtrl,
              scope: $scope
            });

            dialog.result.then(function (requiresRestart) {
              if (requiresRestart) {
                $rootScope.requiresRestartFlag = true;
              }
              $scope.saveWithoutRestart();
            });
          } else {
            $scope.saveWithoutRestart();
          }
          $scope.cleanMetadata();
        }
      };

      $scope.cancel = function(){
        $scope.cleanMetadata();
        $state.go('clusterView',{'clusterName': $scope.currentCluster.name});
      }

    }]);
