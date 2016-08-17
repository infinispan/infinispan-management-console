import {App} from "../../App";

const module: ng.IModule = App.module('managementConsole.api.endpoint-model', []);

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
