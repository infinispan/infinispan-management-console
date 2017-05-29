import {App} from "../../ManagementConsole";
import {EndpointConfigurationCtrl} from "./EndpointConfigurationCtrl";
import {NewSniComponent} from "./components/new-sni/new-sni.component";
import {SniListComponent} from "./components/sni-list/sni-list.component";
import {AddNodeComponent} from "./components/add-node/add-node.component";
import {PrefixListComponent} from "./components/prefix-list/prefix-list.component";
import {NewPrefixComponent} from "./components/new-prefix/new-prefix.component";

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
module.component("newSni", new NewSniComponent());
module.component("newPrefix", new NewPrefixComponent());
module.component("sniList", new SniListComponent());
module.component("prefixList", new PrefixListComponent());
module.component("addNode", new AddNodeComponent());
