import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {CacheContainersCtrl} from "./CacheContainersCtrl";

const module: ng.IModule = App.module("managementConsole.cache-containers", []);

module.controller("CacheContainersCtrl", CacheContainersCtrl);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("containers", {
    parent: "root",
    url: "containers",
    templateUrl: "module/cache-containers/view/cache-containers.html",
    controller: CacheContainersCtrl,
    controllerAs: "ctrl",
    resolve: {
      containers: ["containerService", (containerService) => {
        return containerService.getAllContainers();
      }]
    }
  });
});
