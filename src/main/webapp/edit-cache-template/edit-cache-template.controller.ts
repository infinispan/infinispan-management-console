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
        // $state.go('error404');
      }

      $scope.changedFields = [];
      $scope.mode = $stateParams.mode;

      var server = modelController.getServer();
      var clusters = server.getClusters();
      $scope.currentCluster = server.getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
      $scope.selectedTemplate = $stateParams.cacheConfigurationTemplate;
      $scope.cacheConfigurationType = $stateParams.cacheConfigurationType;
      $scope.configurationModel = configurationModel;

      $scope.configurationSectionHandles = []; //assigned to a configuration section through HTML attribute



      $scope.goToTemplateView = function () {
        $state.go('editCacheContainerTemplates', {
          groupName: $scope.currentCluster.getServerGroupName(),
          clusterName: $scope.currentCluster.name
        });
      };

      $scope.isEditMode = function () {
        return $scope.mode === 'edit';
      };

      $scope.isCreateMode = function () {
        return !$scope.isEditMode();
      };

      $scope.requiresRestart = function () {
        if ($scope.isCreateMode()) {
          return false;
        } else {
          return $scope.configurationSectionHandles.some(function (handle) {
            return handle.requiresRestart();
          });
        }
      };

      //reload configuration page for change of configuration type
      $scope.$watch('configurationModel.type', function (newValue, oldValue) {
        if (oldValue !== newValue) {
          $scope.cacheConfigurationType = newValue;
        }
      });

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
        return $scope.configurationModel['template-name'] !== $scope.selectedTemplate;
      };

      $scope.addCacheTemplate = function (){
        var address = ['profile', $scope.currentCluster.getProfileName(), 'subsystem', 'datagrid-infinispan', 'cache-container',
          $scope.currentCluster.name, 'configurations', 'CONFIGURATIONS'];
        address.push($scope.configurationModel.type + '-configuration');
        address.push($scope.configurationModel['template-name']);

        $scope.configurationModel.template = true; // we create template not concrete configuration
        return cacheCreateController.createCacheConfigurationTemplate(address,
          $scope.configurationModel);
      };

      $scope.updateCacheTemplate = function (){
        var address = ['profile', $scope.currentCluster.getProfileName(), 'subsystem', 'datagrid-infinispan', 'cache-container',
          $scope.currentCluster.name, 'configurations', 'CONFIGURATIONS'];
        address.push($scope.configurationModel.type + '-configuration');
        address.push($scope.configurationModel['template-name']);
        $scope.configurationModel.template = true; // we create template not concrete configuration
        return cacheCreateController.updateConfigurationTemplate(address,
          $scope.configurationModel);
      };

      $scope.saveNewTemplate = function (){
        $scope.addCacheTemplate().then(function(){
          $state.go('editCacheContainerTemplates', {
            groupName: $scope.currentCluster.getServerGroupName(),
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
            groupName: $scope.currentCluster.getServerGroupName(),
            clusterName: $scope.currentCluster.name
          });
          $scope.openRestartModal();
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });
      };

      // It is ok to change template-type when creating a template, as it is not possible for any cache to be using a
      // template that has not be created yet (obviously)
      $scope.configurationModel['is-create-mode'] = $scope.isCreateMode();
      $scope.configurationModel['is-create-with-bare-template'] = $scope.isCreateMode();
    }]);
