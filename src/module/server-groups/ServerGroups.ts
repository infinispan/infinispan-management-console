import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {ServerGroupsCtrl} from "./ServerGroupsCtrl";

const module: ng.IModule = App.module("managementConsole.server-groups", []);

module.controller("ServerGroupsCtrl", ServerGroupsCtrl);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("server-groups", {
    parent: "root",
    url: "server-groups",
    templateUrl: "module/server-groups/view/server-groups.html",
    controller: ServerGroupsCtrl,
    controllerAs: "ctrl",
    resolve: {
      containers: ["containerService", (containerService) => {
        return containerService.getAllContainers();
      }],
      serverGroups: ["serverGroupService", (serverGroupService) => {
        return serverGroupService.getAllServerGroupsMapWithMembers();
      }]
    }
  });
});

