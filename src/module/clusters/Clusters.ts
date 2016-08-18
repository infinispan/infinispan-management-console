import {App} from "../../ManagementConsole";
import {ClustersCtrl} from "./ClustersCtrl";
import "../../services/dmr/DmrService";

const module: ng.IModule = App.module("managementConsole.clusters", []);

module.controller("Clusters", ClustersCtrl);
// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("clusters", {
    url: "/clusters",
    parent: 'root',
    views: {
      application: {
        templateUrl: "module/clusters/view/clusters.html",
        controller: ClustersCtrl,
        controllerAs: "ctrl"
      }
    }
  });
});
