'use strict';

angular.module('managementConsole')
  .factory('cacheContainerConfigurationService', [
    '$q',
    'modelController',
    'utils',
    function ($q, modelController, utils) {

      function loadRole(dmrAddress) {
        var deferred = $q.defer();
        modelController.readResource(dmrAddress, true, false).then(function (response) {
          deferred.resolve(response);
        }).catch(function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }

      function addRole (roleName, address, permissions){
        var permissionsArray = [];
        angular.forEach(permissions, function(value, key){
          if (value){
            permissionsArray.push(key);
          }
        });
        var op = {
          'operation': 'add',
          'name': roleName,
          'permissions': permissionsArray,
          'address': address
        };
        return modelController.execute(op);
      }


      function editRole (address, permissions){
        var permissionsArray = [];
        angular.forEach(permissions, function(value, key){
          if (value){
            permissionsArray.push(key);
          }
        });
        var op = {
          'operation': 'write-attribute',
          'name': 'permissions',
          'value': permissionsArray,
          'address': address
        };
        return modelController.execute(op);
      }

      function removeRole (address){
        var op = {
          'operation': 'remove',
          'address': address
        };
        return modelController.execute(op);
      }

      /**
       * TODO does not work yet
       *
       * @param clusterAddress
       * @returns {*}
       */
      function addAuthorization (clusterAddress){

        var addSecurityOp = {
          'operation': 'add',
          'address': clusterAddress.concat('security', 'SECURITY')
        };
        var addAuthMapperOp = {
          'operation': 'add',
          'audit-logger': 'undefined',
          'mapper':'org.infinispan.security.impl.IdentityRoleMapper',
          'address': clusterAddress.concat('security', 'SECURITY','authorization', 'AUTHORIZATION')
        };
        return modelController.execute(addSecurityOp).then(function(){
          modelController.execute(addAuthMapperOp);
        });
      }

      return {
        loadRole: loadRole,
        addRole: addRole,
        editRole: editRole,
        removeRole: removeRole,
        addAuthorization: addAuthorization
      };
    }
  ]);
