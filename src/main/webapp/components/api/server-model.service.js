'use strict';

angular.module('managementConsole.api')
    .factory('ServerModel', [

    function () {
            /**
             * Represents a Server
             */
            var Server = function (host, server, group, domain) {
                this.host = host;
                this.server = server;
                this.name = (server === null) ? host : host + '/' + server;
                this.group = group;
                this.domain = domain;
                this.lastRefresh = null;
            };

            Server.prototype.getResourcePath = function () {
                return this.domain.getResourcePath().concat('host', this.host, 'server', this.server);
            };

            Server.prototype.getModelController = function () {
                return this.domain.getModelController();
            };

            Server.prototype.refresh = function () {
                return this.getModelController().readAttribute(this.getResourcePath(), 'server-state').then(function (response) {
                    this.state = response.toUpperCase();
                }.bind(this));
            };

            return Server;
    }
  ]);