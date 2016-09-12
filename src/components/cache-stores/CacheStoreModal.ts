import {App} from "../../ManagementConsole";
import {CacheStoreModalButtonCtrl} from "./CacheStoreModalButtonCtrl";

export class CacheStoreModal {
  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      data: "=",
      field: "@",
      fieldMeta: "=",
      modalFields: "=",
      previousValues: "=",
      parentMeta: "=",
      title: "@"
    };
    this.controller = CacheStoreModalButtonCtrl;
    this.templateUrl = "components/cache-stores/view/modal-button.html";
  }
}

const module: ng.IModule = App.module("managementConsole.components.cache-stores.modal", []);
module.component("cacheStoreModal", new CacheStoreModal());
