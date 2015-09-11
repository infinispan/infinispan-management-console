'use strict';

angular.module('managementConsole.api')
    .factory('EndpointModel', [
    function () {
            var Endpoint = function (binding, port, encryption) {
                this.name = binding;
                this.port = port;
                this.encryption = encryption;
            };

            Endpoint.prototype.refresh = function () {
               //likely not needed
            };

            return Endpoint;
    }
  ]);
