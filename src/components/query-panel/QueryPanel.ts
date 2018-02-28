import {App} from "../../ManagementConsole";
import {QueryPanelCtrl} from "./QueryPanelCtrl";

export class QueryPanel {

  bindings: any;
  controller: any;
  template: string;
  controllerAs: string;

  constructor() {
    this.bindings = {
      cacheName: "<",
      name: "@",
      description: "@",
      panelType: "@",
    };
    this.controller = QueryPanelCtrl;
    this.controllerAs = "ctrl";
    this.template = "<div ng-include='ctrl.getTemplateUrl()'></div>";
  }
}

const module: ng.IModule = App.module("managementConsole.components.query-panel", []);
module.component("queryPanel", new QueryPanel());
