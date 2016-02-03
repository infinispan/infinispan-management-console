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

      function writeGenericThreadpool (address, valueMap){
        //we don't have a DMR op to write multiple atts at once
        var deferred = $q.defer();
        try {
          modelController.writeAttribute(address, 'max-threads', valueMap['max-threads']);
          modelController.writeAttribute(address, 'min-threads', valueMap['min-threads']);
          modelController.writeAttribute(address, 'queue-length', valueMap['queue-length']);
          modelController.writeAttribute(address, 'keepalive-time', valueMap['keepalive-time']);
          deferred.resolve(true);
        } catch (err){
          deferred.reject();
        }
        return deferred.promise;
      }

      function writeThreadPool(address, valueMap) {
        //we don't have a DMR op to write multiple atts at once
        var deferred = $q.defer();
        try {
          modelController.writeAttribute(address, 'max-threads', valueMap['max-threads']);
          modelController.writeAttribute(address, 'keepalive-time', valueMap['keepalive-time']);
          deferred.resolve(true);
        } catch (err) {
          deferred.reject();
        }
        return deferred.promise;
      }

      function saveTransport(address, transport) {
        //we don't have a DMR op to write multiple atts at once
        var deferred = $q.defer();
        try {
          modelController.writeAttribute(address, 'channel', transport.channel);
          modelController.writeAttribute(address, 'lock-timeout', transport['lock-timeout']);
          modelController.writeAttribute(address, 'strict-peer-to-peer', transport['strict-peer-to-peer']);
          deferred.resolve(true);
        } catch (err) {
          deferred.reject();
        }
        return deferred.promise;
      }

      return {
        loadRole: loadRole,
        addRole: addRole,
        editRole: editRole,
        removeRole: removeRole,
        addAuthorization: addAuthorization,
        writeGenericThreadpool: writeGenericThreadpool,
        writeThreadPool: writeThreadPool,
        saveTransport: saveTransport
      };
    }
  ]);
