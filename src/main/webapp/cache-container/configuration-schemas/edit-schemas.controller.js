'use strict';

angular.module('managementConsole')
  .controller('editContainerSchemasCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheContainerConfigurationService',
    function ($scope, $state, $stateParams, utils, $modal, modelController, cacheContainerConfigurationService) {
      if (!$stateParams.clusterName && !$stateParams.cacheName) {
        $state.go('error404');
      }

      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);

      $scope.availableSchemas = [];

      // Refresh schemas
      $scope.loadSchemas = function() {
         cacheContainerConfigurationService.loadSchemas($scope.currentCluster).then(
           function(response) {
              $scope.availableSchemas = response;
           }
         );
      };

      $scope.loadSchemas();

      // Opens confirmation modal
      $scope.openConfirmationModal = function (schemaName) {
        $scope.schemaName = schemaName;

        var confirmRemoveController= function ($scope, $state, $modalInstance) {
            $scope.confirmRemoveSchema = function () {
              $scope.removeSchema(schemaName);
            };

            $scope.cancelModal = function () {
              $modalInstance.close();
            };
        };

        $modal.open({
          templateUrl: 'cache-container/configuration-schemas/confirmation-delete-schema-modal.html',
          controller:   confirmRemoveController,
          scope: $scope
        });

      };

      var editSchemaModalInstanceCtrl = function ($scope, $state, $modalInstance, currentCluster, modelController, schema) {

          $scope.schema = schema ;
          $scope.successSchemaDeploy = false;
          $scope.errorDeploying    = false;
          $scope.errorDescription  = null;

          $scope.cancel = function () {
            $modalInstance.close();
          };

          // Schema creation
          $scope.createSchema = function () {
            $scope.errorExecuting = false;
            $scope.errorDescription = null;
            $scope.successExecuteOperation = false;

            // add extension automatically
            var realName = $scope.schema.name;
            if( realName.indexOf('.proto')===-1) {
                realName += '.proto';
            }

            cacheContainerConfigurationService.deploySchema(currentCluster, realName, $scope.schema.body).then(
                function() {
                  $scope.errorExecuting = false;
                  $scope.successExecuteOperation = true;
                  $modalInstance.close();
                },
                function(reason) {
                  $scope.errorExecuting = true;
                  $scope.errorDescription = reason;
                }
            );
        };
      };

    $scope.openCreateSchemaModal = function (schema) {
      if( schema === null ) {
        schema = {editing:false};
      }

      var d = $modal.open({
        templateUrl: 'cache-container/configuration-schemas/edit-schema-modal.html',
        controller: editSchemaModalInstanceCtrl,
        scope: $scope,
        size: 'lg',
        resolve: {
            currentCluster:  function() { return $scope.currentCluster; },
            modelController: function() { return modelController; },
            schema:          function() { return schema; }
        }
      });

      d.result.then(
        function() {
          // Refresh the list of schemas
          $scope.loadSchemas();
        }
      );
   };

   $scope.openEditSchemaModal = function(schemaName) {
      // Load schema content
      cacheContainerConfigurationService.loadSchema($scope.currentCluster, schemaName)
        .then(function(response){
            var script = {name: schemaName, body: response, editing:true};
            $scope.openCreateSchemaModal(script);
        },function(error) {
           $scope.openErrorModal(error);
        }
      );
   };

    $scope.removeSchema = function (name) {
      cacheContainerConfigurationService.removeSchema($scope.currentCluster, name).then(function(){
       $scope.loadSchemas();
      }).catch(function (e) {
        $scope.openErrorModal(e);
      });
    };


 }]);
