'use strict';

angular.module('managementConsole')
.controller('TasksViewCtrl', [
  '$scope',
  '$stateParams',
  'modelController',
  'clusterNodesService',
  'utils',
  '$modal',
  '$controller',
    'taskService',
  function ($scope, $stateParams, modelController, clusterNodesService, utils, $modal, $controller, taskService) {

      // Extend from cluster view controller, given we need some functions for the menus and we don't want to replicate them here
      angular.extend(this, $controller('ClusterViewCtrl',{$scope: $scope}));

      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);
      $scope.selectedView = 'running';
      $scope.runningTasks = [];
      $scope.taskHistory = [];

      // User feedback report
      $scope.successExecuteOperation = false;
      $scope.errorExecuting = false;
      $scope.errorDescription = null;

      // Fetch the list of cluster events
      $scope.refreshTaskHistory = function (maxLines) {
        taskService.getTaskHistory($scope.currentCluster, maxLines).then(function (response) {
          $scope.taskHistory = response;
        });
      };

      // Refresh running tasks
      $scope.refreshRunningTasks = function () {
        taskService.getRunningTasks($scope.currentCluster).then(function (response) {
          $scope.runningTasks = response;
        });
      };

      $scope.refresh = function() {
          $scope.refreshRunningTasks();
          $scope.refreshTaskHistory();
          $scope.currentCluster.refresh();
      };

      $scope.currentClusterAvailability = function () {
          return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
      };

      $scope.currentClusterAvailabilityAsString = function () {
          return utils.clusterAvailability($scope.currentCluster);
      };

      // Force initial refresh
      $scope.refresh();


      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Modal dialog to display task output
      //

      var ViewEventDetailsModalController = function ($scope, $modalInstance, event) {
        $scope.event = event;
        $scope.cancel = function () {
          $modalInstance.dismiss();
        };
      };

      $scope.displayEventDetails = function (event) {
        return $modal.open({
            templateUrl: 'cluster-view/display-event-modal.html',
            size: 'lg',
            controller: ViewEventDetailsModalController,
            resolve: {
              event: function () {
                return event;
              }
            }
          }
        );
      };


      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Task creation controller
      //
      //
      var CreateTaskModalController = function($scope, $modalInstance, modelController, currentCluster) {

        //Parameters
        var numberOfParams = 5;

        // Initialize form properties
        $scope.availableTasks = [];
        $scope.availableNodes = [];

        angular.forEach(modelController.getServer().getNodes(),
          function (node) {
            if (node.isRunning()) {
              $scope.availableNodes.push(node.name);
            }
          });

        $scope.params = [];
        for (var i = 0; i < numberOfParams; i++) {
          $scope.params.push({name: '', value: ''});
        }

        $scope.selectedCache = null;
        $scope.selectedTask = null;
        $scope.selectedNode = null;
        $scope.errorLaunching = false;
        $scope.successLaunching = false;
        $scope.taskOutput = null;
        $scope.asyncTask = false;

        // Load tasks
        $scope.loadTasks = function () {
          taskService.loadTasks(currentCluster).then(function(response){
            $scope.availableTasks = response;
          });
        };

        $scope.executeTask = function (server) {
          taskService.executeTask(currentCluster, server, $scope.selectedTask.name,
            $scope.selectedCache.name, $scope.asyncTask, $scope.params).then(function (response) {
              $scope.successTaskLaunch = true;
              $scope.taskOutput = response;
            }).catch(function (e) {
              $scope.errorLaunching = true;
              $scope.errorDescription = e;
            }).finally(function () {
              if ($scope.asyncTask) {
                $modalInstance.dismiss();
              }
            });
        };

        // Task creation
        $scope.createTask = function () {
          $scope.errorLaunching = false;
          $scope.errorDescription = null;
          if (utils.isNotNullOrUndefined($scope.selectedNode)) {
            var server = currentCluster.domain.getNode($scope.selectedNode);
            $scope.executeTask(server);
          } else {
            clusterNodesService.getCoordinator(currentCluster).then(function (coord) {
              $scope.executeTask(coord);
            });
          }
        };

        // Get list of caches
        $scope.caches = currentCluster.getCachesAsArray();

        // Get list of tasks
        $scope.loadTasks();

        $scope.cancel = function() {
          $modalInstance.dismiss();
        };
      };

      $scope.openTaskDialog = function () {
        return $modal.open({
            templateUrl: 'cluster-view/create-task-modal.html',
            size: 'lg',
            controller: CreateTaskModalController,
            resolve: {
              modelController: function () {
                return modelController;
              },
              currentCluster: function () {
                return $scope.currentCluster;
              }
            }
          }
        );
      };
  }]);
