import {App} from "../../ManagementConsole";
import {ClustersCtrl} from "./ClustersCtrl";
import "../../services/dmr/DmrService";
import {NavbarCtrl} from "../navbar/NavbarCtrl";

const module: ng.IModule = App.module("managementConsole.clusters", []);

module.controller("Clusters", ClustersCtrl);
// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("clusters", {
    url: "/clusters",
    views: {
      application: {
        templateUrl: "module/clusters/view/clusters.html",
        controller: ClustersCtrl,
        controllerAs: "ctrl"
      }
    }
  });
});
