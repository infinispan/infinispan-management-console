import {App} from "../../../ManagementConsole";
import {FormGroupCtrl} from "./FormGroupCtrl";

export class FieldInfo {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      data: "=",
      field: "@",
      label: "@",
      parent: "@",
      meta: "=",
      previousValue: "=",
      placeholder: "@",
      readOnly: "=",
      optionString: "@",
      optionValues: "=",
      changeCallback: "=",
      undoCallback: "="
    };
    this.controller = FormGroupCtrl;
    this.templateUrl = "components/forms/form-group/view/form-group.html";
  }
}

const module: ng.IModule = App.module("managementConsole.components.forms.form-group", []);
module.component("formGroup", new FieldInfo());
