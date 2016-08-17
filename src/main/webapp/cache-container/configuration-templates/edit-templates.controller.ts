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
    'CONSTANTS',
    function ($scope, $state, $stateParams, utils, $modal, modelController, cacheCreateController, configurationTemplates, CONSTANTS) {

      $scope.currentCluster = modelController.getServer().getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
      $scope.confs = $scope.currentCluster.getConfigurationTemplatesFromModel(configurationTemplates);

      var AddCacheTemplateModalInstanceCtrl = function ($scope, $state, $modalInstance) {

        $scope.newTemplateName = '';
        $scope.availableTemplates = [];

        //now add no base template option
        $scope.availableTemplates.push({
          name: CONSTANTS.NO_BASE_CONFIGURATION_TEMPLATE,
          type: 'distributed-cache',
          mode: 'SYNC'
        });

        var templates = $scope.currentCluster.getConfigurationsTemplates();
        angular.forEach(templates, function (template){
          $scope.availableTemplates.push(template);
        });

        $scope.selectedTemplate = $scope.availableTemplates[0];

        $scope.createNewTemplate = function () {
          $modalInstance.close();
          $state.go('editCacheTemplate', {
            groupName: $scope.currentCluster.getServerGroupName(),
            clusterName: $scope.currentCluster.name,
            templateName: $scope.newTemplateName,
            cacheConfigurationTemplate: $scope.selectedTemplate.name,
            cacheConfigurationType: $scope.selectedTemplate.type,
            mode:'create'
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
        if (utils.isNotNullOrUndefined(template.security) && utils.isNotNullOrUndefined(template.security.SECURITY.authorization)
          && template.security.SECURITY.authorization.AUTHORIZATION.enabled){
          traits = traits.concat('Secured ');
        }
        return traits;
      };

      $scope.editTemplate = function (template) {
        $state.go('editCacheTemplate', {
          groupName: $scope.currentCluster.getServerGroupName(),
          clusterName: $scope.currentCluster.name,
          templateName: template.name,
          cacheConfigurationTemplate: template.name,
          cacheConfigurationType: template.type,
          mode:'edit'
        });
      };

      $scope.removeTemplate = function (template) {
        cacheCreateController.removeCacheConfigurationNode($scope.currentCluster.getProfileName(),
          $scope.currentCluster.getName(),
          template.type, template.name).then(function () {
            $state.go('editCacheContainerTemplates', {
              groupName: $scope.currentCluster.getServerGroupName(),
              clusterName: $scope.currentCluster.name
            }, {reload: true});
          }
        ).catch(function (e) {
            $scope.openErrorModal(e);
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
