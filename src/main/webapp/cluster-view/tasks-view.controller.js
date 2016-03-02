'use strict';

angular.module('managementConsole')
.controller('TasksViewCtrl', [
  '$scope',
  '$stateParams',
  '$state',
  '$q',
  'modelController',
  'cacheCreateController',
  'clusterNodesService',
  'utils',
  '$modal',
  '$controller',
  function ($scope, $stateParams, $state, $q, modelController, cacheCreateController, clusterNodesService, utils, $modal, $controller) {

      // Extend from cluster view controller, given we need some functions for the menus and we don't want to replicate them here
      angular.extend(this, $controller('ClusterViewCtrl',{$scope: $scope}));

      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);
      $scope.selectedView = 'running';
      $scope.runningTasks = [];
      $scope.taskHistory  = [];

      // User feedback report
      $scope.successExecuteOperation = false;
      $scope.errorExecuting          = false;
      $scope.errorDescription        = null;

      // Fetch the list of cluster events
      $scope.refreshTaskHistory = function(maxLines) {
        clusterNodesService.getCoordinator($scope.currentCluster).then(function (coord) {
          var resourcePathCacheContainer = coord.getResourcePath()
            .concat('subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.name);

          var op = {
            'operation': 'read-event-log',
            'address': resourcePathCacheContainer,
            "lines": maxLines,
            "category": "TASKS"
          };

          modelController.execute(op).then(
            function (response) {
              $scope.taskHistory = response;
            });
        });
      };

      // Refresh running tasks
      $scope.refreshRunningTasks = function () {
        clusterNodesService.getCoordinator($scope.currentCluster).then(function (coord) {
          var resourcePathCacheContainer = coord.getResourcePath()
            .concat('subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.name);

          var op = {
            'operation': 'task-status',
            'address': resourcePathCacheContainer
          };

          modelController.execute(op).then(
            function (response) {
              $scope.runningTasks = response;
            }
          );
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

      $scope.displayEventDetails = function(event) {
        return $modal.open( {
          templateUrl: 'cluster-view/display-event-modal.html',
          size: 'lg',
          controller: ViewEventDetailsModalController,
          resolve: {
            event: function() { return event }
          }
          }
        );
      };

      var ViewEventDetailsModalController = function($scope, $modalInstance, event) {
          $scope.event = event;
          $scope.cancel = function() {
            $modalInstance.dismiss();
          }
      };

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Task creation controller
      //
      //
      var CreateTaskModalController = function($scope, $modalInstance, modelController, currentCluster) {

        // Initialize form properties
        $scope.availableTasks   = [];
        $scope.availableNodes   = [];

        angular.forEach( modelController.getServer().getNodes(),
           function(node) {
              if( node.isRunning()) {
                $scope.availableNodes.push(node.name);
              }
        });

        $scope.selectedCache    = null;
        $scope.selectedTask     = null;
        $scope.selectedNode     = null;
        $scope.errorLaunching   = false;
        $scope.successLaunching = false;
        $scope.taskOutput  = null;
        $scope.param1_name = null; $scope.param1_value = null;
        $scope.param2_name = null; $scope.param2_value = null;
        $scope.param3_name = null; $scope.param3_value = null;
        $scope.param4_name = null; $scope.param4_value = null;
        $scope.param5_name = null; $scope.param5_value = null;
        $scope.asyncTask = false;

        // Load tasks
        $scope.loadTasks = function () {
          clusterNodesService.getCoordinator(currentCluster).then(function (coord) {
            var resourcePathCacheContainer = coord.getResourcePath()
              .concat('subsystem', 'datagrid-infinispan', 'cache-container', currentCluster.name);

            var op = {
              'operation': 'task-list',
              'address': resourcePathCacheContainer
            };

            modelController.execute(op).then(
              function (response) {
                $scope.availableTasks = response;
              }
            );
          });
        };

        $scope.executeTask = function (server) {
          var resourcePathCacheContainer = server.getResourcePath()
            .concat('subsystem', 'datagrid-infinispan', 'cache-container', currentCluster.name);

          var op = {
            'operation': 'task-execute',
            'address': resourcePathCacheContainer,
            "name": $scope.selectedTask.name,
            "cache-name": $scope.selectedCache.name,
            "async": $scope.asyncTask
          };

          // Now add parameters as needed
          var parameters = {};
          if ($scope.param1_name != null) {
            parameters[$scope.param1_name] = $scope.param1_value;
          }
          if ($scope.param2_name != null) {
            parameters[$scope.param2_name] = $scope.param2_value;
          }
          if ($scope.param3_name != null) {
            parameters[$scope.param3_name] = $scope.param3_value;
          }
          if ($scope.param4_name != null) {
            parameters[$scope.param4_name] = $scope.param4_value;
          }
          if ($scope.param5_name != null) {
            parameters[$scope.param5_name] = $scope.param5_value;
          }
          op["parameters"] = parameters;

          modelController.execute(op).then(
            function (response) {
              $scope.successTaskLaunch = true;
              $scope.taskOutput = response;
              if ($scope.asyncTask) {
                $modalInstance.dismiss();
              }
            },
            function (reason) {
              $scope.errorLaunching = true;
              $scope.errorDescription = reason;
            }
          );
        };

        // Task creation
        $scope.createTask = function() {
            $scope.errorLaunching = false;
            $scope.errorDescription = null;


            if(utils.isNotNullOrUndefined($scope.selectedNode)) {
              var server = currentCluster.domain.getNode($scope.selectedNode);
              $scope.executeTask(server);
            } else {
              clusterNodesService.getCoordinator(currentCluster).then(function(coord){
                $scope.executeTask(coord)
              });
            }
        };

        // Get list of caches
        $scope.caches = currentCluster.getCachesAsArray();

        // Get list of tasks
        $scope.loadTasks();

        $scope.cancel = function() {
          $modalInstance.dismiss();
        }
      };

      $scope.openTaskDialog = function() {
        return $modal.open( {
          templateUrl: 'cluster-view/create-task-modal.html',
          size: 'lg',
          controller: CreateTaskModalController,
          resolve: {
            modelController: function() { return modelController; },
            currentCluster:  function() { return $scope.currentCluster; },
          }
          }
        );
      }
  }]);
