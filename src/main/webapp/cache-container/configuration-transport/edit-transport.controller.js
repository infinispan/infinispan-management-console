'use strict';

angular.module('managementConsole')
  .controller('editContainerTransportCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheContainerConfigurationService',
    'clusterNodesService',
    function ($scope, $state, $stateParams, utils, $modal, modelController, cacheContainerConfigurationService, clusterNodesService) {
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

      $scope.currentCluster = modelController.getServer().getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
      $scope.transport = $scope.currentCluster.getTransportConfiguration();
      $scope.metadata = $scope.currentCluster.getMetadata().children.transport['model-description'];
      $scope.configurationHandle = {};

      $scope.requiresRestart = function (){
        return $scope.configurationHandle.requiresRestart();
      };

      $scope.hasDirtyFields = function (){
        return $scope.configurationHandle.isAnyFieldModified();
      };

      $scope.cleanMetadata = function (){
        $scope.configurationHandle.cleanMetadata();
      };

      $scope.saveHelper = function(restart){
        var address = $scope.currentCluster.getResourcePath().concat('transport','TRANSPORT');
        var promise = cacheContainerConfigurationService.saveTransport(address, $scope.transport);
        if (restart){
          promise.then(function (){
            clusterNodesService.restartCluster();
          });
        }
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
                $scope.saveHelper(true);
              } else {
                $scope.saveHelper(false);
              }
            });
          } else {
            $scope.saveHelper(false);
          }
        }
        $scope.cleanMetadata();
      };

      $scope.cancel = function(){
        $state.go('clusterView',{
          groupName: $scope.currentCluster.getServerGroupName(),
          clusterName: $scope.currentCluster.name
        });
      };

    }]);
