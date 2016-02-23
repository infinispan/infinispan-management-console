'use strict';

angular.module('managementConsole')
  .controller('editContainerSecurityCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    '$modal',
    'modelController',
    'cacheContainerConfigurationService',
    'securityConfig',
    function ($scope, $state, $stateParams, utils, $modal, modelController, cacheContainerConfigurationService, securityConfig) {

      var AddRoleModalInstanceCtrl = function ($scope, $state, $modalInstance, role) {
        $scope.roleName = '';
        $scope.permissions = {};
        if (utils.isNotNullOrUndefined(role)) {
          $scope.roleName = role.name;
          angular.forEach(role.permissions, function(value, key){
            $scope.permissions[value] = true;
          });
        }

        $scope.createNewRole = function () {
          var address = $scope.getRoleDMRAddress($scope.roleName);
          cacheContainerConfigurationService.addRole($scope.roleName, address, $scope.permissions).then(function(){
            $modalInstance.close();
            $state.go('editCacheContainerSecurity', {
              clusterName: $scope.currentCluster.name
            });
            $state.reload();
          }).catch(function(){
            $modalInstance.close();
            //TODO error handling
          });
        };

        $scope.editExistingRole = function () {
          var address = $scope.getRoleDMRAddress($scope.roleName);
          cacheContainerConfigurationService.editRole(address, $scope.permissions);
          $modalInstance.close();
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      };

      //start of editContainerSecurityCtrl controller

      if (!$stateParams.clusterName) {
        $state.go('error404');
      }

      $scope.currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);

      $scope.mappers = [];
      $scope.roles = [];

      $scope.securityAuthorizationDefined = utils.isNotNullOrUndefined(securityConfig) && utils.isNotNullOrUndefined(securityConfig.authorization);

      if ($scope.securityAuthorizationDefined) {
        $scope.mappers = [];
        $scope.mappers.push(securityConfig.authorization.AUTHORIZATION.mapper);
        $scope.roles = securityConfig.authorization.AUTHORIZATION.role;
      }

      $scope.openAddRoleModal = function () {
        $scope.isNewRole = true;
        $modal.open({
          templateUrl: 'cache-container/configuration-security/add-role-modal.html',
          controller: AddRoleModalInstanceCtrl,
          scope: $scope,
          resolve: {
            role: undefined
          }
        });
      };

      $scope.openEditRoleModal = function (role) {
        $scope.isNewRole = false;
        $modal.open({
          templateUrl: 'cache-container/configuration-security/add-role-modal.html',
          controller: AddRoleModalInstanceCtrl,
          scope: $scope,
          resolve: {
            role: cacheContainerConfigurationService.loadRole($scope.getRoleDMRAddress(role.name))
          }
        });
      };

      $scope.getRoleDMRAddress = function (roleName) {
        var clusterAddress = $scope.currentCluster.getResourcePath();
        var roleAddress = clusterAddress.concat('security', 'SECURITY', 'authorization', 'AUTHORIZATION', 'role', roleName);
        return roleAddress;
      };

      $scope.defineAuthorization = function () {
        //TODO not working yet
        $scope.mappers = ['org.infinispan.security.impl.IdentityRoleMapper'];
        $scope.securityAuthorizationDefined = true;
        var clusterAddress = $scope.currentCluster.getResourcePath();
        cacheContainerConfigurationService.addSecurity(clusterAddress).then(function(){
          cacheContainerConfigurationService.addAuthorization(clusterAddress).then (function(){
            $state.go('editCacheContainerSecurity', {
              clusterName: $scope.currentCluster.name
            });
            $state.reload();
          })
        });
      };

      $scope.removeRole = function (role){
        var address  = $scope.getRoleDMRAddress(role.name);
        cacheContainerConfigurationService.removeRole(address).then(function(){
          $state.go('editCacheContainerSecurity', {
            clusterName: $scope.currentCluster.name
          });
          $state.reload();
        }).catch(function(){
          //TODO error handling
        });
      };

    }]);
