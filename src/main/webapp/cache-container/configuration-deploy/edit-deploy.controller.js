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
          });
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

        $scope.confirmRemoveScript = function () {
          $scope.removeScript($scope.artifact);
        };

        $scope.cancelModal = function () {
          $modalInstance.close();
        };
      };

      $scope.clusters = modelController.getServer().getClusters();
      $scope.deployments = deployments;
      $scope.currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);
      $scope.serverGroup = $scope.currentCluster.getServerGroupName();

      $scope.deployedArtifacts = {};
      $scope.availableTasks = [];
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

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Script deployment code

      $scope.loadScriptTasks = function() {
           cacheContainerConfigurationService.loadScriptTasks($scope.currentCluster).then(
             function(response) {
                $scope.availableTasks = response;
             }
           );
      };

      $scope.loadScriptTasks();

      var EditScriptModalInstanceCtrl = function ($scope, $state, $modalInstance, currentCluster, modelController, script) {

          $scope.task = script;
          $scope.successTaskDeploy = false;
          $scope.errorDeploying    = false;
          $scope.errorDescription  = null;

          // Recreates script body from
          $scope.buildBody = function() {
            var realTaskName = $scope.task.name;

            var body = "// name=" + realTaskName + ", language=" + $scope.task.language + "\n";
            body    += "// mode=" + $scope.task.mode + "\n";
            if( $scope.task.parameters != null && $scope.task.parameters.length > 0) {
              body    += "// parameters=[" + $scope.task.parameters + "]\n";
            }
            if($scope.task.role && $scope.task.role.length > 0) {
              body    += "// role=" + $scope.task.role + "\n";
            }

            body+="\n";
            body+=$scope.task.body;

            return body;
          };

          $scope.cancel = function () {
            $modalInstance.close();
          };

          // Task creation
          $scope.createScript = function () {
            $scope.errorExecuting = false;
            $scope.errorDescription = null;
            $scope.successExecuteOperation = false;

            // In edit mode, we allow the user to edit the script directly
            var realBody = $scope.task.editing ? $scope.task.body : $scope.buildBody();

            cacheContainerConfigurationService.deployScript(currentCluster, $scope.task.name, realBody).then(
                function(response) {
                  $scope.errorExecuting = false;
                  $scope.successExecuteOperation = true;
                  $modalInstance.close();
                },
                function(reason) {
                  $scope.errorExecuting = true;
                  $scope.errorDescription = reason;
                }
            );
        };
      };

    $scope.openCreateScriptModal = function (script) {
      if( script == null ) {
        script = {editing:false};
      }

      var d = $modal.open({
        templateUrl: 'cache-container/configuration-deploy/edit-script-modal.html',
        controller: EditScriptModalInstanceCtrl,
        scope: $scope,
        size: 'lg',
        resolve: {
            currentCluster:  function() { return $scope.currentCluster },
            modelController: function() { return modelController },
            script:          function() { return script; }
        }
      });

      d.result.then(
        function() {
          // Refresh the list of tasks
          $scope.loadScriptTasks();
        }
      );
   };

   $scope.openEditScriptModal = function(scriptName) {
      // Load script content
      cacheContainerConfigurationService.loadScriptBody($scope.currentCluster, scriptName)
        .then(function(response){
            var script = {name: scriptName, body: response, editing:true};
            $scope.openCreateScriptModal(script);
        },function(error) {
           $scope.openErrorModal(error);
        }
      );
   };

    $scope.removeScript = function (name) {
      cacheContainerConfigurationService.removeScript($scope.currentCluster, name).then(function(){
        $state.go('editCacheContainerDeploy', {
          clusterName: $scope.currentCluster.name
        }, {reload: true});
      }).catch(function (e) {
        $scope.openErrorModal(e);
      });
    };


}]);
