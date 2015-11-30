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
    function ($scope, $state, $stateParams, utils, $modal, modelController, cacheCreateController) {
      if (!$stateParams.clusterName && !$stateParams.cacheName) {
        $state.go('error404');
      }

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

      if($scope.isViewExistingCacheWorkflow()){
        $scope.caches = $scope.currentCluster.getCaches();
        $scope.currentCache = $scope.caches[$scope.currentCacheName];
        $scope.currentCache.refresh();
        $scope.currentCacheMode = utils.getCacheMode($scope.currentCache);
        $scope.selectedTemplate = $scope.currentCache.getConfigurationTemplate();
        $scope.cacheConfigurationType = $scope.currentCache.getType();
      }
      $scope.configurationModel = {};
      //load configuration template
      var promise = cacheCreateController.getConfigurationTemplate($scope.cacheConfigurationType, $scope.selectedTemplate);
      promise.then(function (response) {
        $scope.configurationModel = response;
        $scope.configurationModel.name = $scope.currentCacheName;
        $scope.configurationModel.type = $scope.cacheConfigurationType;
        $scope.configurationModel.template = $scope.selectedTemplate;
      });



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
        cacheCreateController.createCacheFromTemplate(address,
          $scope.configurationModel.template)
          .then(function () {
          $scope.currentCluster.refresh()
            .then(function(){
            $state.go('clusterView', {clusterName: $scope.currentCluster.name});
          });
        });
      };

      $scope.cancel = function () {
        $state.go('clusterView', {clusterName: $scope.currentCluster.name});
      };

      $scope.isTemplateNameEdited = function () {
        return $scope.configurationModel.template != $scope.selectedTemplate;
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
          });
        } else {
          $scope.createCache();
        }
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

var CacheTemplateModalInstanceCtrl = function ($scope, utils, $modalInstance, $stateParams) {


  $scope.cancelModal = function () {
    $modalInstance.dismiss('cancel');
  };

};
