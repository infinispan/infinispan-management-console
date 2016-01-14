'use strict';

angular.module('managementConsole')
  .controller('editContainerTemplatesCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheCreateController',
    'configurationTemplates',
    function ($scope, $state, $stateParams, utils, $modal, modelController, cacheCreateController, configurationTemplates) {

      $scope.currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);
      $scope.confs = $scope.currentCluster.getConfigurationTemplatesFromModel(configurationTemplates);

      var AddCacheTemplateModalInstanceCtrl = function ($scope, $state, $modalInstance) {

        $scope.newTemplateName = '';
        $scope.availableTemplates = $scope.currentCluster.getConfigurationsTemplates();
        $scope.selectedTemplate = $scope.availableTemplates[0];

        $scope.createNewTemplate = function () {
          $modalInstance.close();
          $state.go('editCacheTemplate', {
            clusterName: $scope.currentCluster.name,
            templateName: $scope.newTemplateName,
            cacheConfigurationTemplate: $scope.selectedTemplate.name,
            cacheConfigurationType: 'distributed-cache'
          });
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      };

      $scope.extractTraits = function (template){
        //TODO move this to a method of configuration template
        var traits = '';
        if (utils.isNotNullOrUndefined(template.remotebackup)){
          traits = traits.concat('Remotely backedup ');
        }
        if (utils.isNotNullOrUndefined(template.compatibility)){
          traits = traits.concat('Compatible ');
        }
        if (utils.isNotNullOrUndefined(template.indexing)){
          traits = traits.concat('Indexed ');
        }
        if (utils.isNotNullOrUndefined(template.eviction)){
          traits = traits.concat('Bounded ');
        }
        if (utils.isNotNullOrUndefined(template.transaction) && (template.transaction.TRANSACTION.mode !== 'NONE')){
          traits = traits.concat('Transactional ');
        }
        if (utils.isNotNullOrUndefined(template.security) && utils.isNotNullOrUndefined(template.security.SECURITY.authorization)){
          traits = traits.concat('Secured ');
        }
        return traits;
      };

      $scope.editTemplate = function (template) {
        $state.go('editCacheTemplate', {
          clusterName: $scope.currentCluster.name,
          templateName: template,
          cacheConfigurationTemplate: template,
          cacheConfigurationType: 'distributed-cache'
        });
      };

      $scope.removeTemplate = function (cacheTemplateType, template) {
        cacheCreateController.removeCacheConfigurationNode(cacheTemplateType, template).then(function () {
            $state.go('editCacheContainerTemplates', {
              clusterName: $scope.currentCluster.name
            });
            $state.reload();
          }
        ).catch(function () {
            //TODO error handling
          });
      };

      $scope.openModal = function () {

        $modal.open({
          templateUrl: 'cache-container/configuration-templates/add-cache-template-modal.html',
          controller: AddCacheTemplateModalInstanceCtrl,
          scope: $scope
        });
      };

    }]);
