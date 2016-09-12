import {App} from "../../../ManagementConsole";
import {InformationButtonCtrl} from "./InformationButtonCtrl";

export class InformationModal implements ng.IComponentOptions {

  bindings: any;
  controller: any;
  controllerAs: string;
  templateUrl: string;

  constructor() {
    this.bindings = {
      header: "@",
      information: "@"
    };
    this.controller = InformationButtonCtrl;
    this.controllerAs = "ctrl";
    this.templateUrl = "common/dialogs/views/button.html";
  }
}

const module: ng.IModule = App.module("managementConsole.components.modals.information", []);
module.component("informationModal", new InformationModal());
