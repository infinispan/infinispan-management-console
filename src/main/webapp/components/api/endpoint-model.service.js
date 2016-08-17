define(["require", "exports", "../../App"], function (require, exports, App_1) {
    "use strict";
    var module = App_1.App.module('managementConsole.api.endpoint-model', []);
    module.factory('EndpointModel', [
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
});
//# sourceMappingURL=endpoint-model.service.js.map