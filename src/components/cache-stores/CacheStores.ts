import {CacheStoresCtrl} from "./CacheStoresCtrl";
import {App} from "../../ManagementConsole";

export class CacheStores {
  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      cacheType: "@",
      data: "=",
      meta: "=",
      readOnly: "=",
      configCallbacks: "="
    };
    this.controller = CacheStoresCtrl;
    this.templateUrl = "components/cache-stores/view/cache-stores.html";
  }
}

const module: ng.IModule = App.module("managementConsole.components.cache-stores", []);
module.component("cacheStores", new CacheStores());
