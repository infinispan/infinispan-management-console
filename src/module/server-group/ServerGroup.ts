import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {ServerGroupCtrl} from "./ServerGroupCtrl";
import {serverFilter} from "./ServerGroupFilter";
import {IStateParamsService} from "angular-ui-router";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerGroup} from "../../services/server-group/IServerGroup";

const module: ng.IModule = App.module("managementConsole.server-group", []);

module.controller("ServerGroupCtrl", ServerGroupCtrl);
module.filter("serverFilter", serverFilter);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("server-group", {
    parent: "root",
    url: "server-groups/:serverGroup",
    templateUrl: "module/server-group/view/server-group.html",
    controller: ServerGroupCtrl,
    controllerAs: "ctrl",
    params: {
      serverGroup: null,
      refresh: false
    },
    resolve: {
      serverGroup: ["$stateParams", "serverGroupService", ($stateParams, serverGroupService) => {
        // TODO add serverGroup object as optional parameter and if exists don't call service again unless refresh is true
        let serverGroup: string = $stateParams.serverGroup;
        return serverGroupService.getServerGroupMapWithMembers(serverGroup);
      }],
      available: ["$stateParams", "serverGroupService", "serverGroup",
        ($stateParams:IStateParamsService, serverGroupService:ServerGroupService, serverGroup:IServerGroup) => {
        return serverGroupService.isGroupAvailable(serverGroup);
      }]
    }
  });
});
