import {MemoryCtrl} from "./MemoryCtrl";
import {App} from "../../ManagementConsole";

export class Memory {
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
    this.controller = MemoryCtrl;
    this.templateUrl = "components/memory/view/memory.html";
  }
}

const module: ng.IModule = App.module("managementConsole.components.memory", []);
module.component("memory", new Memory());
