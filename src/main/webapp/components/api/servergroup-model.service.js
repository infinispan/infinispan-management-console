'use strict';

angular.module('managementConsole.api')
    .factory('ServerGroupModel', [
    '$q',
    function ($q) {
            /**
             * Represents a ServerGroup
             */
            var ServerGroup = function (name, profile, domain) {
                this.name = name;
                this.profile = profile;
                this.domain = domain;
                this.lastRefresh = null;
                this.socketBindingGroup = null;
                this.socketBindings = {};
            };

            ServerGroup.prototype.getModelController = function () {
                return this.domain.getModelController();
            };

            ServerGroup.prototype.getResourcePath = function () {
                return this.domain.getResourcePath().concat('server-group', this.name);
            };

            ServerGroup.prototype.getSocketBindings = function () {
              return this.socketBindings;
            };

            ServerGroup.prototype.getSocketPortBindingOffset = function () {
              return this.socketPortBindingOffset;
            };

            ServerGroup.prototype.refresh = function () {
                // Nothing to do here, return a resolved promise


              this.getModelController().readResource(this.getResourcePath(), false, false).then(function (response) {
                this.socketBindingGroup = response['socket-binding-group'];
                this.socketPortBindingOffset = response['socket-binding-port-offset'];
                var path = [].concat('socket-binding-group', this.socketBindingGroup);
                this.getModelController().readChildrenResources(path, 'socket-binding', 2, true, false).then(function (bindings) {
                  this.socketBindings = bindings;
                }.bind(this));
              }.bind(this));
            };

            ServerGroup.prototype.startServers = function (){
              return this.executeOp('start-servers');
            };

            ServerGroup.prototype.stopServers = function (){
              return this.executeOp('stop-servers');
            };

            ServerGroup.prototype.executeOp = function (operationName){
              var op = {
                'operation': operationName,
                'address': this.getResourcePath()
              };
              return this.getModelController().execute(op);
            };

            return ServerGroup;
    }
  ]);
