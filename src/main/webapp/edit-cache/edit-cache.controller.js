'use strict';

angular.module('managementConsole')
  .controller('editCacheCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheCreateController',
    'configurationModel',
    function ($scope, $state, $stateParams, utils, $modal, modelController, cacheCreateController, configurationModel) {
      if (!$stateParams.clusterName && !$stateParams.cacheName) {
        $state.go('error404');
      }

      $scope.changedFields = [];

      $scope.isAddNewCacheWorkflow = function () {
        return $stateParams.newCacheCreation === true;
      };

      $scope.isViewExistingCacheWorkflow = function () {
        return !$scope.isAddNewCacheWorkflow();
      };


      var server = modelController.getServer();
      var clusters = server.getClusters();
      $scope.currentCacheName = $stateParams.cacheName;
      $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
      $scope.selectedTemplate = $stateParams.cacheConfigurationTemplate;
      $scope.cacheConfigurationType = $stateParams.cacheConfigurationType;

      if ($scope.isViewExistingCacheWorkflow()) {
        $scope.currentCache = $scope.currentCluster.getCaches()[$scope.currentCacheName];
        $scope.currentCacheMode = utils.getCacheMode($scope.currentCache);
        $scope.selectedTemplate = $scope.currentCache.getConfigurationTemplate();
        $scope.cacheConfigurationType = $scope.currentCache.getType();
      }
      $scope.configurationModel = configurationModel;
      $scope.configurationModel.name = $scope.currentCacheName;
      $scope.configurationModel.type = $scope.cacheConfigurationType;
      $scope.configurationModel.template = $scope.selectedTemplate;


      $scope.currentCacheAvailability = function () {
        return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
      };

      $scope.currentCacheType = function () {
        return utils.getCacheType($scope.currentCache);
      };

      $scope.currentCacheNumOwners = function () {
        return $scope.currentCache.isDistributed() &&
        utils.isNotNullOrUndefined($scope.currentCache.configuration.owners) ? $scope.currentCache.configuration.owners + ' owners' : '';
      };

      $scope.createCache = function () {
        var address = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.name];
        address.push($scope.configurationModel.type);
        address.push($scope.currentCacheName);
        cacheCreateController.createCacheFromTemplate(address, $scope.configurationModel.template).then(function () {
          $state.go('clusterView', {clusterName: $scope.currentCluster.name, refresh: true}, {reload: true});
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });
      };

      $scope.cancel = function () {
        $state.go('clusterView', {clusterName: $scope.currentCluster.name});
      };


      $scope.$on('configurationFieldDirty', function (event, field){
        if($scope.changedFields.indexOf(field) === -1){
          $scope.changedFields.push(field);
        }
      });

      $scope.$on('configurationFieldClean', function (event, field){
        var index = $scope.changedFields.indexOf(field);
        if(index > -1){
          $scope.changedFields.splice(index, 1);
        }
      });

      $scope.isConfigurationFormDirty = function () {
        return  $scope.changedFields.length > 0;
      };

      $scope.isTemplateNameEdited = function () {
        return $scope.configurationModel.template !== $scope.selectedTemplate;
      };

      $scope.saveCacheConfigurationTemplate = function (){
        var address = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan', 'cache-container',
          $scope.currentCluster.name, 'configurations', 'CONFIGURATIONS'];
        address.push($scope.configurationModel.type + '-configuration');
        address.push($scope.configurationModel.template);

        return cacheCreateController.createCacheConfigurationTemplate(address,
          $scope.configurationModel,
          $scope.configurationModel.type);
      };

      $scope.createCacheWithTemplate = function () {
        if ($scope.isTemplateNameEdited()) {
          $scope.saveCacheConfigurationTemplate().then(function () {
            $scope.createCache();
          }).catch(function (e) {
            $scope.openErrorModal(e);
          });
        } else {
          $scope.createCache();
        }
      };

      $scope.onCacheCreateClick = function () {
        if($scope.isConfigurationFormDirty() && !$scope.isTemplateNameEdited()){
          $scope.openModal('dirty');
        } else {
          $scope.openModal('cache');
        }
      };

      $scope.onTemplateUpdateClick = function () {
        if($scope.isConfigurationFormDirty()){
          $scope.saveCacheConfigurationTemplate();
        }
      };

      var CacheTemplateModalInstanceCtrl = function ($scope, utils, $modalInstance) {


        $scope.cancelModal = function () {
          $modalInstance.dismiss('cancel');
        };

      };

      $scope.openModal = function (mode) {
        $scope.mode = mode;
        $modal.open({
          templateUrl: 'edit-cache/confirmation-cache-modal.html',
          controller: CacheTemplateModalInstanceCtrl,
          scope: $scope
        });
      };

    }]);
