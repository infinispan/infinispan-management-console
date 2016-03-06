'use strict';

angular.module('managementConsole')
  .controller('editContainerTasksCtrl', [
    '$scope',
    '$q',
    '$state',
    '$stateParams',
    '$modal',
    'utils',
    'modelController',
    'cacheContainerConfigurationService',
    function ($scope, $q, $state, $stateParams, $modal, utils, modelController, cacheContainerConfigurationService) {
      
      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);
      $scope.serverGroup = $scope.currentCluster.getServerGroupName();
      $scope.availableTasks = [];
      
      $scope.loadScriptTasks = function () {
        cacheContainerConfigurationService.loadScriptTasks($scope.currentCluster).then(
          function (response) {
            $scope.availableTasks = response;
          }
        );
      };

      $scope.loadScriptTasks();

      var TasksModalInstanceCtrl = function ($scope, $state, $modalInstance) {
        $scope.cancelModal = function () {
          $modalInstance.close();
        };
      };

      $scope.openConfirmationModal = function (artifact, mode) {
        $scope.artifact = artifact;
        $scope.mode = mode;

        $modal.open({
          templateUrl: 'cache-container/configuration-tasks/confirmation-modal.html',
          controller: TasksModalInstanceCtrl,
          scope: $scope
        });
      };
  
      var EditScriptModalInstanceCtrl = function ($scope, $state, $modalInstance, currentCluster, modelController, script) {

        $scope.task = script;
        $scope.successTaskDeploy = false;
        $scope.errorDeploying = false;
        $scope.errorDescription = null;

        // Recreates script body from
        $scope.buildBody = function () {
          var realTaskName = $scope.task.name;

          var body = '// name=' + realTaskName + ', language=' + $scope.task.language + '\n';
          body += '// mode=' + $scope.task.mode + '\n';
          if ($scope.task.parameters !== null && $scope.task.parameters.length > 0) {
            body += '// parameters=[' + $scope.task.parameters + ']\n';
          }
          if ($scope.task.role && $scope.task.role.length > 0) {
            body += '// role=' + $scope.task.role + '\n';
          }

          body += '\n';
          body += $scope.task.body;

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
            function () {
              $scope.errorExecuting = false;
              $scope.successExecuteOperation = true;
              $modalInstance.close();
            },
            function (reason) {
              $scope.errorExecuting = true;
              $scope.errorDescription = reason;
            }
          );
        };
      };

      $scope.openCreateScriptModal = function (script) {
        if (script === null) {
          script = {
            editing: false
          };
        }

        var d = $modal.open({
          templateUrl: 'cache-container/configuration-tasks/edit-script-modal.html',
          controller: EditScriptModalInstanceCtrl,
          scope: $scope,
          size: 'lg',
          resolve: {
            currentCluster: function () {
              return $scope.currentCluster;
            },
            modelController: function () {
              return modelController;
            },
            script: function () {
              return script;
            }
          }
        });

        d.result.then(
          function () {
            // Refresh the list of tasks
            $scope.loadScriptTasks();
          }
        );
      };

      $scope.openEditScriptModal = function (scriptName) {
        // Load script content
        cacheContainerConfigurationService.loadScriptBody($scope.currentCluster, scriptName)
          .then(function (response) {
            var script = {
              name: scriptName,
              body: response,
              editing: true
            };
            $scope.openCreateScriptModal(script);
          }, function (error) {
            $scope.openErrorModal(error);
          });
      };

      $scope.removeScript = function (name) {
        cacheContainerConfigurationService.removeScript($scope.currentCluster, name).then(function () {
          $state.go('editCacheContainerTasks', {
            clusterName: $scope.currentCluster.name
          }, {
            reload: true
          });
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });
      };
}]);