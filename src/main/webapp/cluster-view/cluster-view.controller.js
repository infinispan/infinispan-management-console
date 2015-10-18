'use strict';

angular.module('managementConsole')
  .controller('ClusterViewCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$q',
    'modelController',
    'cacheCreateController',
    'utils',
    '$modal',
    function ($scope, $stateParams, $state, $q, modelController, cacheCreateController, utils, $modal) {
      if (!modelController.isAuthenticated()) {
        $state.go('/logout');
      }
      $scope.shared = {
        currentCollection: 'caches'
      };
      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);

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

      $scope.isCollapsedTrait = false;
      $scope.isCollapsedType = false;
      $scope.isCollapsedStatus = true;

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

      $scope.openModal = function () {

        var modalInstance = $modal.open({
          templateUrl: 'cluster-view/add-cache-modal.html',
          controller: AddCacheModalInstanceCtrl,
          scope: $scope
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          //$log.info('Modal dismissed at: ' + new Date());
        });
      };
    }]).filter('cacheTrait', function (){
    return function (cachesInput, traitFilter) {
      var atLeastOneFilterOn = traitFilter.bounded || traitFilter.indexed || traitFilter.compatible || traitFilter.remotebackup
        || traitFilter.persistent || traitFilter.secure || traitFilter.transactional;
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
    }
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

var AddCacheModalInstanceCtrl = function ($scope, $state, $modalInstance, cacheCreateController) {

  $scope.cacheName = null;
  $scope.selectedTemplate = null;
  $scope.configurationTemplates = [];
  $scope.configurationTemplatesMap = {};

  $scope.createCache = function () {
    var address = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.name];
    var cacheType = $scope.configurationTemplatesMap[$scope.selectedTemplate];
    address.push(cacheType);
    address.push($scope.cacheName);
    cacheCreateController.createCacheFromTemplate(address, $scope.selectedTemplate, function () {
      $modalInstance.close();
      $scope.currentCluster.refresh().then(function(){
        $state.go('clusterView', {clusterName: $scope.currentCluster.name});
      });
    });
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };

  angular.forEach(['distributed-cache', 'replicated-cache', 'invalidation-cache', 'local-cache'], function (cacheType){
    var p = cacheCreateController.getConfigurationTemplates(cacheType);
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
};

