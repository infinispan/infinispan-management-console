import {CacheSecurityCtrl} from "./CacheSecurityCtrl";
import {App} from "../../ManagementConsole";

export class CacheSecurity {
  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      data: "=",
      container: "=",
      meta: "=",
      initDefaults: "=",
      readOnly: "=",
      configCallbacks: "="
    };
    this.controller = CacheSecurityCtrl;
    this.templateUrl = "components/cache-security/view/cache-security.html";
  }
}

const module: ng.IModule = App.module("managementConsole.components.cache-security", []);
module.component("cacheSecurity", new CacheSecurity());
