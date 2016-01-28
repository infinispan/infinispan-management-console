'use strict';

angular.module('managementConsole')
  .controller('editCacheTemplateCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheCreateController',
    'configurationModel',
    function ($scope, $state, $stateParams, utils, $modal,
              modelController, cacheCreateController, configurationModel) {
      if (!$stateParams.clusterName) {
        $state.go('error404');
      }

      $scope.changedFields = [];

      var server = modelController.getServer();
      var clusters = server.getClusters();
      $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
      $scope.selectedTemplate = $stateParams.cacheConfigurationTemplate;
      $scope.cacheConfigurationType = $stateParams.cacheConfigurationType;

      $scope.configurationModel = configurationModel;
      $scope.configurationModel.type = $scope.cacheConfigurationType;
      $scope.configurationModel.template = $stateParams.templateName;

      $scope.goToTemplateView = function () {
        $state.go('editCacheContainerTemplates', {
          clusterName: $scope.currentCluster.name
        });
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
        return $scope.changedFields.length > 0;
      };

      $scope.isTemplateNameEdited = function () {
        return $scope.configurationModel.template !== $scope.selectedTemplate;
      };

      $scope.addCacheTemplate = function (){
        var address = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan', 'cache-container',
          $scope.currentCluster.name, 'configurations', 'CONFIGURATIONS'];
        address.push($scope.configurationModel.type + '-configuration');
        address.push($scope.configurationModel.template);

        return cacheCreateController.createCacheConfigurationTemplate(address,
          $scope.configurationModel,
          $scope.configurationModel.type);
      };

      $scope.saveCacheTemplate = function (){
        $scope.addCacheTemplate().then(function(){
          $state.go('editCacheContainerTemplates', {
            clusterName: $scope.currentCluster.name
          });
        }).catch(function(){
          //TODO error handling
        });
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
          templateUrl: 'edit-cache-template/cache-template-modal.html',
          controller: CacheTemplateModalInstanceCtrl,
          scope: $scope
        });
      };

    }]);
