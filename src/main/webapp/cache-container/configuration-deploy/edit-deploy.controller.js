'use strict';

angular.module('managementConsole')
  .controller('editContainerDeployCtrl', [
    '$scope',
    '$q',
    '$state',
    '$stateParams',
    '$modal',
    'utils',
    'modelController',
    'cacheContainerConfigurationService',
    'deployments',
    'deployed',
    function ($scope, $q, $state, $stateParams, $modal, utils, modelController, cacheContainerConfigurationService, deployments, deployed) {

      var UploadArtifactModalInstanceCtrl = function ($scope, $state, $modalInstance) {

        $scope.fileToUpload = null;
        $scope.uploadAndDeployArtifact = function (){
          if (utils.isNotNullOrUndefined($scope.fileToUpload)) {
            var op = {
              operation: 'add',
              address: [{deployment: $scope.fileToUpload.name}],
              'runtime-name': $scope.fileToUpload.name,
              enabled: false,
              content: [{'input-stream-index': 0}]
            };
            return modelController.executeDeploymentOp(op, $scope.fileToUpload, function () {});
          } else {
            return $q.when('nothing uploaded');
          }
        };

        $scope.uploadArtifact = function () {
          $scope.uploadAndDeployArtifact().then(function () {
            $state.go('editCacheContainerDeploy', {
              clusterName: $scope.currentCluster.name
            }, {reload: true});
          }).catch(function (e) {
            $scope.openErrorModal(e);
          });;
        };

        $scope.cancelModal = function () {
          $modalInstance.close();
        };
      };

      var DeployArtifactModalInstanceCtrl = function ($scope, $state, $modalInstance) {

        $scope.confirmDeployArtifact = function (){
          $scope.deployArtifact($scope.artifact);
        };

        $scope.confirmUndeployArtifact = function () {
          $scope.undeployArtifact($scope.artifact);
        };

        $scope.confirmRemoveArtifact = function () {
          $scope.removeArtifact($scope.artifact);
        };

        $scope.cancelModal = function () {
          $modalInstance.close();
        };
      };


      $scope.clusters = modelController.getServer().getClusters();
      $scope.serverGroup = modelController.getServer().getServerGroupName();
      $scope.deployments = deployments;
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);

      $scope.deployedArtifacts = {};
      deployed.forEach(function (deployment){
        $scope.deployedArtifacts[deployment.result.name] = deployment.result;
      });


      $scope.canDeploy = function (deployment){
        var artifact = $scope.deployedArtifacts[deployment];
        if (utils.isNotNullOrUndefined(artifact)){
          return artifact.enabled;
        } else {
          return false;
        }
      };

      $scope.canUndeploy = function (deployment){
        return !$scope.canDeploy(deployment);
      };

      $scope.artifactType = function (name) {
        var artifactExtension = name.split('.').pop();
        return artifactExtension.toUpperCase();
      };

      $scope.removeArtifact = function (name) {
        cacheContainerConfigurationService.removeArtifact(name).then(function(){
          $state.go('editCacheContainerDeploy', {
            clusterName: $scope.currentCluster.name
          }, {reload: true});
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });
      };

      $scope.deployArtifact = function (name) {
        cacheContainerConfigurationService.deployArtifact($scope.serverGroup, name).then(function(){
          $state.go('editCacheContainerDeploy', {
            clusterName: $scope.currentCluster.name
          }, {reload: true});
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });
      };

      $scope.undeployArtifact = function (name) {
        cacheContainerConfigurationService.undeployArtifact($scope.serverGroup, name).then(function () {
          $state.go('editCacheContainerDeploy', {
            clusterName: $scope.currentCluster.name
          }, {reload: true});
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });

      };


      $scope.openUploadModal = function () {

        $modal.open({
          templateUrl: 'cache-container/configuration-deploy/upload-artifact-modal.html',
          controller: UploadArtifactModalInstanceCtrl,
          scope: $scope
        });
      };

      $scope.openConfirmationModal = function (artifact, mode) {
        $scope.artifact = artifact;
        $scope.mode = mode;

        $modal.open({
          templateUrl: 'cache-container/configuration-deploy/confirmation-deploy-modal.html',
          controller: DeployArtifactModalInstanceCtrl,
          scope: $scope
        });
      };

    }]);
