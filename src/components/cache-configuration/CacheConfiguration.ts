import {App} from "../../ManagementConsole";
import {CacheConfigurationCtrl} from "./CacheConfigurationCtrl";

export class CacheConfiguration {

  bindings: any;
  controller: any;
  template: string;

  constructor() {
    this.bindings = {
      cacheType: "@",
      container: "=",
      data: "=",
      meta: "=",
      initDefaults: "=",
      readOnly: "=",
      readOnlyFields: "=",
      configCallbacks: "="
    };
    this.controller = CacheConfigurationCtrl;
    this.template = "<div ng-include='$ctrl.getTemplateUrl()'></div>";
  }
}

const module: ng.IModule = App.module("managementConsole.components.configuration.cache", []);
module.component("cacheConfiguration", new CacheConfiguration());
