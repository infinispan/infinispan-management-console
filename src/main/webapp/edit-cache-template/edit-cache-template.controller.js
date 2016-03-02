'use strict';

angular.module('managementConsole')
  .controller('editCacheTemplateCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheCreateController',
    'configurationModel',
    function ($scope, $rootScope, $state, $stateParams, utils, $modal,
              modelController, cacheCreateController, configurationModel) {
      if (!$stateParams.clusterName) {
        $state.go('error404');
      }

      $scope.changedFields = [];
      $scope.mode = $stateParams.mode;

      var server = modelController.getServer();
      var clusters = server.getClusters();
      $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
      $scope.selectedTemplate = $stateParams.cacheConfigurationTemplate;
      $scope.cacheConfigurationType = $stateParams.cacheConfigurationType;
      $scope.configurationModel = configurationModel;

      $scope.configurationSectionHandles = []; //assigned to a configuration section through HTML attribute

      $scope.requiresRestart = function (){
        return $scope.configurationSectionHandles.some(function (handle) {
          return handle.requiresRestart();
        });
      };


      $scope.goToTemplateView = function () {
        $state.go('editCacheContainerTemplates', {
          clusterName: $scope.currentCluster.name
        });
      };

      $scope.isEditMode = function () {
        return $scope.mode === 'edit';
      };

      $scope.isCreateMode = function () {
        return !$scope.isEditMode();
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
          $scope.configurationModel);
      };

      $scope.updateCacheTemplate = function (){
        var address = ['profile', 'clustered', 'subsystem', 'datagrid-infinispan', 'cache-container',
          $scope.currentCluster.name, 'configurations', 'CONFIGURATIONS'];
        address.push($scope.configurationModel.type + '-configuration');
        address.push($scope.configurationModel.template);

        return cacheCreateController.updateConfigurationTemplate(address,
          $scope.configurationModel);
      };

      $scope.saveNewTemplate = function (){
        $scope.addCacheTemplate().then(function(){
          $state.go('editCacheContainerTemplates', {
            clusterName: $scope.currentCluster.name
          });
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });
      };

      $scope.saveEditedTemplate = function (){
        $scope.updateCacheTemplate().then(function(){
          $rootScope.requiresRestartFlag = $scope.requiresRestart();
          $state.go('editCacheContainerTemplates', {
            clusterName: $scope.currentCluster.name
          });
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });
      };

    }]);
