'use strict';

angular.module('managementConsole')
  .controller('editCacheCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'CONSTANTS',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheCreateController',
    'configurationModel',
    function ($scope, $rootScope, $state, CONSTANTS, $stateParams, utils, $modal, modelController, cacheCreateController, configurationModel) {
      if (!$stateParams.clusterName && !$stateParams.cacheName) {
        $state.go('error404');
      }

      $scope.changedFields = [];

      $scope.isCreateMode = function () {
        return $stateParams.newCacheCreation === true;
      };

      $scope.isCreateModeWithBareTemplate = function () {
        return $scope.isCreateMode() && $stateParams.cacheConfigurationTemplate === CONSTANTS.NO_BASE_CONFIGURATION_TEMPLATE;
      };

      $scope.isEditMode = function () {
        return !$scope.isCreateMode();
      };


      var server = modelController.getServer();
      var clusters = server.getClusters();
      $scope.currentCacheName = $stateParams.cacheName;
      $scope.currentCluster = server.getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
      $scope.selectedTemplate = $stateParams.cacheConfigurationTemplate;
      $scope.cacheConfigurationType = $stateParams.cacheConfigurationType;

      $scope.configurationModel = configurationModel;
      $scope.configurationModel['is-create-mode'] = $scope.isCreateMode();
      $scope.configurationModel['is-create-with-bare-template'] = $scope.isCreateModeWithBareTemplate();
      if ($scope.isEditMode()) {
        $scope.currentCache = $scope.currentCluster.getCaches()[$scope.currentCacheName];
        $scope.currentCacheMode = utils.getCacheMode($scope.currentCache);
        $scope.selectedTemplate = $scope.currentCache.getConfigurationTemplate();
        $scope.cacheConfigurationType = $scope.currentCache.getType();
      }

      if (!$scope.isCreateModeWithBareTemplate()) {
        $scope.configurationModel.name = $scope.currentCacheName;
        $scope.configurationModel.type = $scope.cacheConfigurationType;
        $scope.configurationModel['template-name'] = $scope.selectedTemplate;
      }

      $scope.configurationSectionHandles = []; //assigned to a configuration section through HTML attribute

      $scope.requiresRestart = function () {
        if ($scope.isCreateModeWithBareTemplate()) {
          return false;
        } else {
          return $scope.configurationSectionHandles.some(function (handle) {
            var rr = handle.requiresRestart();
            return rr;
          });
        }
      };

      $scope.launchRestartModal = function () {
        return $rootScope.requiresRestartFlag;
      };


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

      //reload configuration page for change of configuration type
      $scope.$watch('configurationModel.type', function (newValue, oldValue) {
        if (oldValue !== newValue) {
          $scope.cacheConfigurationType = newValue;
        }
      });

      $scope.createCache = function () {
        var address = ['profile', $scope.currentCluster.getProfileName(), 'subsystem', 'datagrid-infinispan', 'cache-container', $scope.currentCluster.name];
        address.push($scope.configurationModel.type);
        address.push($scope.currentCacheName);
        cacheCreateController.createCacheFromTemplate(address, $scope.configurationModel['template-name']).then(function () {
          $state.go('clusterView', {
            groupName: $scope.currentCluster.getServerGroupName(),
            clusterName: $scope.currentCluster.name,
            refresh: true
          }, {reload: true});
        }).catch(function (e) {
          $scope.openErrorModal(e);
        });
      };

      $scope.updateCacheTemplate = function () {
        var address = ['profile', $scope.currentCluster.getProfileName(), 'subsystem', 'datagrid-infinispan', 'cache-container',
          $scope.currentCluster.name, 'configurations', 'CONFIGURATIONS'];
        address.push($scope.configurationModel.type + '-configuration');
        address.push($scope.configurationModel['template-name']);

        return cacheCreateController.updateConfigurationTemplate(address, $scope.configurationModel);
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
        return $scope.configurationModel['template-name'] !== $scope.selectedTemplate;
      };

      $scope.isTemplateNameDefault = function () {
        return $scope.configurationModel['template-name'] === CONSTANTS.NO_BASE_CONFIGURATION_TEMPLATE;
      };

      $scope.saveCacheConfigurationTemplate = function (){
        var address = ['profile', $scope.currentCluster.getProfileName(), 'subsystem', 'datagrid-infinispan', 'cache-container',
          $scope.currentCluster.name, 'configurations', 'CONFIGURATIONS'];
        address.push($scope.configurationModel.type + '-configuration');
        address.push($scope.configurationModel['template-name']);
        $scope.configurationModel.template = false; // we don't create template but concrete configuration

        return cacheCreateController.createCacheConfigurationTemplate(address,
          $scope.configurationModel);
      };

      $scope.createCacheWithTemplate = function () {
        if ($scope.isTemplateNameEdited()) {
          $scope.saveCacheConfigurationTemplate().then(function () {
            $scope.createCache();
          }).catch(function (e) {
            $scope.openErrorModal(e);
          });
        } else {
          $scope.updateCacheTemplate().then(function () {
            $scope.createCache();
            $rootScope.requiresRestartFlag = $scope.requiresRestart();
            $scope.openRestartModal();
          }).catch(function (e) {
            $scope.openErrorModal(e);
          });
        }
      };

      $scope.updateTemplate = function () {
        if ($scope.isTemplateNameEdited()) {
          $scope.saveCacheConfigurationTemplate().then(function () {
            $state.go('clusterView', {
              groupName: $scope.currentCluster.getServerGroupName(),
              clusterName: $scope.currentCluster.name,
              refresh: true
            }, {reload: true});
          }).catch(function (e) {
            $scope.openErrorModal(e);
          });
        } else {
          $scope.updateCacheTemplate().then(function () {
            $rootScope.requiresRestartFlag = $scope.requiresRestart();
            $state.go('clusterView', {
              groupName: $scope.currentCluster.getServerGroupName(),
              clusterName: $scope.currentCluster.name,
              refresh: true
            }, {reload: true});
            $scope.openRestartModal();
          }).catch(function (e) {
            $scope.openErrorModal(e);
          });
        }
      };

      $scope.onCacheCreateClick = function () {
        if($scope.isTemplateNameDefault()){
          $scope.openModal('dirty');
        }
        else if($scope.isConfigurationFormDirty() && $scope.isEditMode()){
          $scope.openModal('template');
        } else {
          $scope.openModal('cache');
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
