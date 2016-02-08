'use strict';

angular.module('managementConsole')
  .controller('editContainerDeployCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$modal',
    'utils',
    'modelController',
    'deployments',
    function ($scope, $state, $stateParams, $modal, utils, modelController, deployments) {

      var UploadArtifactModalInstanceCtrl = function ($scope, $state, $modalInstance) {

        $scope.fileToUpload = null;
        $scope.uploadAndDeployArtifact = function (){
          if (utils.isNotNullOrUndefined($scope.fileToUpload)) {
            var op = modelController.createAddArtifactOp($scope.fileToUpload.name);
            return modelController.executeDeploymentOp(op, $scope.fileToUpload, function () {});
          }
        };

        $scope.uploadArtifact = function () {
          var promise = $scope.uploadAndDeployArtifact();
          $modalInstance.close();
          if (utils.isNotNullOrUndefined(promise)){
            $state.go('editCacheContainerDeploy', {
              clusterName: $scope.currentCluster.name
            });
            $state.reload();
          }
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      };


      $scope.clusters = modelController.getServer().getClusters();
      $scope.serverGroup = modelController.getServer().getServerGroupName();
      $scope.deployments = deployments;
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);


      $scope.artifactType = function (name) {
        var ext = name.split('.').pop();
        return ext.toUpperCase();
      };

      $scope.removeArtifact = function (name) {
        console.log('Invoking remove for ' + name);
        modelController.removeArtifact($scope.serverGroup, name).then(function(){
          $state.go('editCacheContainerDeploy', {
            clusterName: $scope.currentCluster.name
          });
          $state.reload();
        })
      };

      $scope.deployArtifact = function (name) {
        console.log('Invoking deploy for ' + name);
        var promise = modelController.deployArtifact($scope.serverGroup, name);
        promise.then (function (response){
          console.log('Deploy for ' + name + ' is ' + response);
        })
      };

      $scope.undeployArtifact = function (name) {
        console.log('Invoking undeploy for ' + name);
        return modelController.undeployArtifact($scope.serverGroup, name);
      };


      $scope.openUploadModal = function () {

        $modal.open({
          templateUrl: 'cache-container/configuration-deploy/upload-artifact-modal.html',
          controller: UploadArtifactModalInstanceCtrl,
          scope: $scope
        });
      };

    }]);
