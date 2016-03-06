'use strict';

var app = angular.module('managementConsole')
  .controller('ClusterViewCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'CONSTANTS',
    '$q',
    'modelController',
    'cacheCreateController',
    'clusterNodesService',
    'utils',
    '$modal',
    function ($scope, $stateParams, $state, CONSTANTS, $q, modelController, cacheCreateController, clusterNodesService, utils, $modal) {
      var AddCacheModalInstanceCtrl = function ($scope, $state, $modalInstance, cacheCreateController) {

        $scope.cacheName;
        $scope.selectedTemplate;
        $scope.configurationTemplates = [];
        $scope.configurationTemplatesMap = {};

        // User feedback report
        $scope.successExecuteOperation = false;
        $scope.errorExecuting = false;
        $scope.errorDescription = null;

        $scope.createCache = function () {
          var address = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.getName()];
          var cacheType = $scope.configurationTemplatesMap[$scope.selectedTemplate];
          address.push(cacheType);
          address.push($scope.cacheName);
          cacheCreateController.createCacheFromTemplate(address, $scope.selectedTemplate, function () {
            $modalInstance.close();
            $scope.currentCluster.refresh().then(function(){
              $state.go('clusterView', {clusterName: $scope.currentCluster.getName()});
            });
          });
        };

        $scope.configureTemplate = function () {
          var address = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.getName()];
          var cacheType = $scope.configurationTemplatesMap[$scope.selectedTemplate];
          address.push(cacheType);
          address.push($scope.cacheName);
          $modalInstance.close();
          $state.go('editCache', {
            clusterName: $scope.currentCluster.getName(),
            cacheName: $scope.cacheName,
            cacheConfigurationTemplate: $scope.selectedTemplate,
            cacheConfigurationType:cacheType,
            newCacheCreation:true
          });
        };

        $scope.isTemplateSelected = function () {
          return utils.isNotNullOrUndefined($scope.selectedTemplate) && $scope.selectedTemplate.length > 0;
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };

        //Find all configuration templates across all clusters (cache containers)
        angular.forEach($scope.clusters, function (cluster){
          angular.forEach(['distributed-cache', 'replicated-cache', 'invalidation-cache', 'local-cache'], function (cacheType){
            var p = cacheCreateController.getConfigurationTemplates(cluster.getName(), cacheType);
            p.then(function (response) {
              var p = response[cacheType + '-configuration'];
              for (var key in p) {
                if (p.hasOwnProperty(key)) {
                  $scope.configurationTemplates.push(key);
                  $scope.configurationTemplatesMap[key] = cacheType;
                }
              }
            });
          });
        });

        //now add no base template option
        $scope.configurationTemplates.push(CONSTANTS.NO_BASE_CONFIGURATION_TEMPLATE);
        $scope.configurationTemplatesMap[CONSTANTS.NO_BASE_CONFIGURATION_TEMPLATE] = 'distributed-cache';
        $scope.selectedTemplate = $scope.configurationTemplates[0];

        $scope.cancel = function () {
          $modalInstance.close();
        };
      };

      var WIPModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.cancel = function () {
          $modalInstance.close();
        };
      };

      $scope.shared = {
        currentCollection: 'caches'
      };
      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);
      $scope.group = $scope.currentCluster.getServerGroupName();

      $scope.$watch('currentCluster', function (currentCluster) {
        if (currentCluster && currentCluster.name !== $stateParams.clusterName) {
          $state.go('clusterView', {
            'clusterName': currentCluster.name
          });
        }
      });

      $scope.currentClusterAvailability = function () {
        return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
      };

      $scope.currentClusterAvailabilityAsString = function () {
        return utils.clusterAvailability($scope.currentCluster);
      };

      // For caches with backup sites, we need to retrieve their status to look into their site status
      // We don't do it for every cache to avoid costly remote calls in the general case
      $scope.refreshBackupSiteStatus = function () {
        $scope.offlineSites = {};
        $scope.onlineSites = {};
        $scope.mixedSites = {};

        angular.forEach($scope.currentCluster.getCachesAsArray(), function (cache) {
          if (cache.hasRemoteBackup()) {
            modelController.getServer().fetchCacheStats($scope.currentCluster, cache).then(
              function (response) {
                $scope.offlineSites[cache.name] = response[0]['sites-offline'];
                $scope.onlineSites[cache.name] = response[0]['sites-online'];
                $scope.mixedSites[cache.name] = response[0]['sites-mixed'];
              }
            )
          }
        });
      };

      $scope.refresh = function () {
        if (this.currentClusterAvailability()) {
          $scope.currentCluster.refresh();
          $scope.refreshBackupSiteStatus();
        }
      };

      if ($stateParams.refresh){
        $scope.refresh();
      }

      // For caches with backup sites, we need to retrieve their status to look into their site status
      // We don't do it for every cache to avoid costly remote calls in the general case
      $scope.refreshBackupSiteStatus = function () {
        $scope.offlineSites = {};
        $scope.onlineSites = {};
        $scope.mixedSites = {};

        angular.forEach($scope.currentCluster.getCachesAsArray(), function (cache) {
          if (cache.hasRemoteBackup()) {
            modelController.getServer().fetchCacheStats($scope.currentCluster, cache).then(
              function (response) {
                $scope.offlineSites[cache.name] = response[0]['sites-offline'];
                $scope.onlineSites[cache.name] = response[0]['sites-online'];
                $scope.mixedSites[cache.name] = response[0]['sites-mixed'];
              }
            )
          }
        });
      };


     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     // Cache container rebalancing control
     //
      $scope.setCacheContainerRebalance = function (rebalance) {

        // User feedback report
        $scope.successExecuteOperation = false;
        $scope.errorExecuting = false;
        $scope.errorDescription = null;

        clusterNodesService.getCoordinator($scope.currentCluster).then(function (coord) {
          var path = coord.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.getName());

          var op = {
            'operation': "cluster-rebalance",
            'address': path,
            "value": rebalance
          };

          return modelController.execute(op).then(
            function (response) {
              $scope.successExecuteOperation = true;
              $scope.refresh();
            },
            function (reason) {
              $scope.errorExecuting = true;
              $scope.errorDescription = reason;
              $scope.refresh();
            }
          );
        });
      };

      $scope.confirmAndSetCacheContainerRebalance = function (rebalanceValue, confirmationMessage) {

        // Get confirmation dialog
        var confirmDialog = $modal.open({
          templateUrl: 'cluster-view/confirmation-message-modal.html',
          controller: function ($scope, $modalInstance) {
            $scope.confirmationMessage = confirmationMessage;

            $scope.ok = function () {
              $modalInstance.close(true);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss();
            };
          },
          scope: $scope
        });

        confirmDialog.result.then(function (result) {
          $scope.setCacheContainerRebalance(rebalanceValue);
        });
      };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////



      $scope.refreshBackupSiteStatus();

      $scope.isCollapsedTrait = false;
      $scope.isCollapsedType = false;
      $scope.isCollapsedStatus = true;

      $scope.matchHeight = function () {
        utils.matchHeight(document, '.card-pf');
      };

      $scope.traitCheckboxes = {
        bounded: false,
        remotebackup: false,
        indexed: false,
        compatible: false,
        persistent: false,
        secure: false,
        transactional: false
      };

      $scope.typeCheckboxes = {
        local: false,
        distributed: false,
        replicated: false,
        invalidation: false
      };

      $scope.statusCheckboxes = {
        indexing: false,
        offline: false,
        rebalancing: false,
        splitbrain: false
      };

      $scope.openWIPModal = function () {
        var modalInstance = $modal.open({
          templateUrl: 'workinprogress.html',
          controller: WIPModalInstanceCtrl,
          resolve: {
            items: function () {
              return null;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        });
      };


      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Site management modal
      //
      //
      var SiteManagementModalController = function ($scope, $modalInstance, modelController, currentCluster) {

        $scope.currentCluster = currentCluster;
        $scope.offlineSites = [];
        $scope.onlineSites = [];
        $scope.mixedSites = [];
        $scope.successExecuteOperation = false;
        $scope.errorExecuting = false;
        $scope.errorDescription = null;

        // Confirms and executes a site operation
        $scope.executeSiteOperation = function (siteName, operationId, confirmationMessage) {

          // Get confirmation dialog
          var confirmDialog = $modal.open({
            templateUrl: 'cluster-view/confirmation-message-modal.html',
            controller: function ($scope, $modalInstance) {

              $scope.confirmationMessage = confirmationMessage;

              $scope.ok = function () {
                $modalInstance.close(true);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss();
              };
            },
            scope: $scope
          });

          confirmDialog.result.then(function (result) {
            clusterNodesService.getCoordinator($scope.currentCluster).then(function(coord){
              var resourcePathCacheContainer = coord.getResourcePath()
                .concat('subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.getName());

              var op = {
                'operation': operationId,
                'address': resourcePathCacheContainer,
                "site-name": siteName
              };

              $scope.successExecuteOperation = false;
              $scope.errorExecuting = false;

              modelController.execute(op).then(
                function (response) {
                  $scope.successExecuteOperation = true;
                  $scope.refresh();
                },
                function (reason) {
                  $scope.refresh();
                  $scope.errorExecuting = true;
                  $scope.errorDescription = reason;
                }
              );
            });
          });
        };

        // Refresh site status
        $scope.refreshRemoteSitesStatus = function (cluster) {
          clusterNodesService.getCoordinator(cluster).then(function(coord){
            var resourcePathCacheContainer = coord.getResourcePath()
              .concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.name);

            // Refresh list of offline sites
            modelController.readAttribute(resourcePathCacheContainer, 'sites-offline').then(
              function (response) {
                if (response != null && response.constructor === Array) {
                  $scope.offlineSites = response
                } else {
                  $scope.offlineSites = [];
                }
              }
            );

            // Refresh list of online sites
            modelController.readAttribute(resourcePathCacheContainer, 'sites-online').then(
              function (response) {
                if (response != null && response.constructor === Array) {
                  $scope.onlineSites = response
                } else {
                  $scope.onlineSites = [];
                }
              }
            );

            // Refresh list of mixed sites
            modelController.readAttribute(resourcePathCacheContainer, 'sites-mixed').then(
              function (response) {
                if (response != null && response.constructor === Array) {
                  $scope.mixedSites = response
                } else {
                  $scope.mixedSites = [];
                }
              }
            );
          });

        };

        $scope.refresh = function () {
          // Refresh site status
          $scope.refreshRemoteSitesStatus($scope.currentCluster);
        };

        $scope.cancel = function () {
          $modalInstance.dismiss();
        };

        $scope.refresh();
      };

      /// End of site management dialog controller

      // Opens the site management dialog
      $scope.openSiteDialog = function () {
        return $modal.open({
          templateUrl: 'cluster-view/manage-sites-modal.html',
          size: 'lg',
          controller: SiteManagementModalController,
          resolve: {
            modelController: function () {
              return modelController;
            },
            currentCluster: function () {
              return $scope.currentCluster;
            }
          }
        });
      };

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.openModal = function () {

        var modalInstance = $modal.open({
          templateUrl: 'cluster-view/add-cache-modal.html',
          controller: AddCacheModalInstanceCtrl,
          scope: $scope
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        });
      };
    }]).filter('cacheTrait', function (){
    return function (cachesInput, traitFilter) {
      var atLeastOneFilterOn = (traitFilter.bounded || traitFilter.indexed || traitFilter.compatible ||
      traitFilter.remotebackup || traitFilter.persistent || traitFilter.secure || traitFilter.transactional);
      if (atLeastOneFilterOn) {
        var caches = [];
        angular.forEach(cachesInput, function (cache) {
          var bounded = traitFilter.bounded && cache.isBounded();
          var indexed = traitFilter.indexed && cache.isIndexed();
          var compatible = traitFilter.compatible && cache.hasCompatibility();
          var remoteBackup = traitFilter.remotebackup && cache.hasRemoteBackup();
          var persistent = traitFilter.persistent && cache.isPersistent();
          var secure = traitFilter.secure && cache.hasSecurityEnabled();
          var transactional = traitFilter.transactional && cache.isTransactional();

          if (bounded || indexed || remoteBackup || compatible || persistent || secure || transactional) {
            caches.push(cache);
          }
        });
        return caches;
      }
      else {
        return cachesInput;
      }
    };
  }).filter('cacheType', function () {
    return function (cachesInput, typeFilter) {
      var atLeastOneFilterOn = typeFilter.local || typeFilter.distributed || typeFilter.invalidation || typeFilter.replicated;
      if (atLeastOneFilterOn) {
        var caches = [];
        angular.forEach(cachesInput, function (cache) {
          var local = typeFilter.local && cache.isLocal();
          var distributed = typeFilter.distributed && cache.isDistributed();
          var invalidation = typeFilter.invalidation && cache.isInvalidation();
          var replicated = typeFilter.replicated && cache.isReplicated();

          if (local || distributed || invalidation || replicated) {
            caches.push(cache);
          }
        });
        return caches;
      } else {
        return cachesInput;
      }
    };
  });

app.directive('validCacheName', function($stateParams, modelController) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.validCacheName = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        scope.currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);
        return !scope.currentCluster.hasCache(modelValue);
      };
    }
  };
});


