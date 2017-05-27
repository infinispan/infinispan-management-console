import {App} from "../../ManagementConsole";
import {EndpointConfigurationCtrl} from "./EndpointConfigurationCtrl";
import {SniViewComponent} from "./components/sni-view.component";

export class EndpointConfiguration {

  bindings: any;
  controller: any;
  template: string;

  constructor() {
    this.bindings = {
      endpointType: "@",
      data: "=",
      meta: "=",
      initDefaults: "=",
      readOnly: "=",
      readOnlyFields: "=",
      configCallbacks: "="
    };
    this.controller = EndpointConfigurationCtrl;
    this.template = "<div ng-include='$ctrl.getTemplateUrl()'></div>";
  }
}

const module: ng.IModule = App.module("managementConsole.components.configuration.endpoint", []);
module.component("endpointConfiguration", new EndpointConfiguration());
module.component("sniView", new SniViewComponent());