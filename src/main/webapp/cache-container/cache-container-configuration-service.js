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
       *
       *
       * @param clusterAddress
       * @returns {*}
       */
      function addSecurity (clusterAddress){
        var addSecurityOp = {
          'operation': 'add',
          'address': clusterAddress.concat('security', 'SECURITY')
        };
        return modelController.execute(addSecurityOp);
      }

      /**
       *
       *
       * @param clusterAddress
       * @returns {*}
       */
      function addAuthorization (clusterAddress){
        var addAuthMapperOp = {
          'operation': 'add',
          'audit-logger': 'undefined',
          'mapper':'org.infinispan.security.impl.IdentityRoleMapper',
          'address': clusterAddress.concat('security', 'SECURITY','authorization', 'AUTHORIZATION')
        };
        return modelController.execute(addAuthMapperOp);
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


      function deployArtifact (serverGroup, deployment) {
        var op = {
          operation: 'add',
          enabled: true,
          address: ['server-group', serverGroup,  'deployment', deployment]
        };
        return modelController.execute(op);
      }

      function undeployArtifact (serverGroup, deployment) {
        var op = {
          operation: 'remove',
          address: ['server-group', serverGroup,  'deployment', deployment]
        };
        return modelController.execute(op);
      }

      function removeArtifact (deployment) {
        var op = {
          operation: 'remove',
          address: ['deployment', deployment]
        };
        return modelController.execute(op);
      }

      function getArtifacts () {
        return modelController.readChildrenResources([],'deployment');
      }

      function getDeployedArtifact(serverGroup) {
        return modelController.readResource(['server-group', serverGroup, 'deployment', '*'], true);
      }

      // Returns the DMR resource path for the current cache container
      function getClusterResourcePath(currentCluster) {
          return currentCluster.domain.getFirstServer().getResourcePath()
                .concat('subsystem', 'datagrid-infinispan', 'cache-container', currentCluster.name);
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Script related functions
      //

      // Deploys a script - if script exists, updates its body
      function deployScript(currentCluster, name, body) {
          var op = {
               'operation': 'script-add',
               'address':    getClusterResourcePath(currentCluster),
               "name":       name,
               "code":       body
          };

          return modelController.execute(op);
      }

      // Deletes a script
      function removeScript(currentCluster, scriptName) {
          var op = {
            'operation': 'script-remove',
            'address':    getClusterResourcePath(currentCluster),
            'name':       scriptName
          };

          return modelController.execute(op);
      }

      // Loads script body
      function loadScriptBody(currentCluster, scriptName) {
          var op = {
            'operation': 'script-cat',
            'address':    getClusterResourcePath(currentCluster),
            'name':       scriptName
          };

          return modelController.execute(op);
      }

      // Load all script task
      function loadScriptTasks(currentCluster) {
          var op = {
             'operation': 'task-list',
             'address': getClusterResourcePath(currentCluster)
          };

          return modelController.execute(op);
      }


      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Schema related functions
      //
      function loadSchemas(currentCluster) {
          var op = {
             'operation':   'get-proto-schema-names',
             'address':     getClusterResourcePath(currentCluster)
          };

          return modelController.execute(op);
      }

      function deploySchema(currentCluster, schemaName, schemaBody) {
          var op = {
            'operation':     'register-proto-schemas',
            'file-contents': [schemaBody],
            'file-names':    [schemaName],
            'address':       getClusterResourcePath(currentCluster)
          };

          return modelController.execute(op);
      }

      function loadSchema(currentCluster, schemaName) {
        var op = {
           'operation':  'get-proto-schema',
           'file-name':   schemaName,
           'address':     getClusterResourcePath(currentCluster)
        };

        return modelController.execute(op);
      }

      function removeSchema(currentCluster, schemaName) {
        var op = {
           'operation':   'unregister-proto-schemas',
           'file-names':  [schemaName],
           'address':     getClusterResourcePath(currentCluster)
        };

        return modelController.execute(op);
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      return {
        loadRole: loadRole,
        addRole: addRole,
        editRole: editRole,
        removeRole: removeRole,
        addAuthorization: addAuthorization,
        addSecurity: addSecurity,
        writeGenericThreadpool: writeGenericThreadpool,
        writeThreadPool: writeThreadPool,
        saveTransport: saveTransport,
        getArtifacts:getArtifacts,
        getDeployedArtifact:getDeployedArtifact,
        deployArtifact:deployArtifact,
        undeployArtifact:undeployArtifact,
        removeArtifact:removeArtifact,

        deployScript:deployScript,
        removeScript:removeScript,
        loadScriptBody:loadScriptBody,
        loadScriptTasks:loadScriptTasks,

        loadSchemas:loadSchemas,
        deploySchema:deploySchema,
        loadSchema:loadSchema,
        removeSchema:removeSchema
      };
    }
  ]);
