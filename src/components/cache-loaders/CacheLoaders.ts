import {CacheLoadersCtrl} from "./CacheLoadersCtrl";
import {App} from "../../ManagementConsole";

export class CacheLoaders {
  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      data: "=",
      meta: "=",
      readOnly: "=",
      configCallbacks: "="
    };
    this.controller = CacheLoadersCtrl;
    this.templateUrl = "components/cache-loaders/view/cache-loaders.html";
  }
}

const module: ng.IModule = App.module("managementConsole.components.cache-loaders", []);
module.component("cacheLoaders", new CacheLoaders());
