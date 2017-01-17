import {App} from "../../../ManagementConsole";
import {FieldInfoCtrl} from "./FieldInfoCtrl";

export class FieldInfo {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      data: "=",
      meta: "=",
      parent: "@",
      field: "@",
      previousValue: "=",
      readOnly: "=",
      undoCallback: "="
    };
    this.controller = FieldInfoCtrl;
    this.templateUrl = "components/forms/field-info/view/field-info.html";
  }
}

const module: ng.IModule = App.module("managementConsole.components.forms.field-info", []);
module.component("fieldInfo", new FieldInfo());

