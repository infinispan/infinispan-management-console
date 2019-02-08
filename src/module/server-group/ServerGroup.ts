import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {ServerGroupCtrl} from "./ServerGroupCtrl";
import {EndpointsCtrl} from "./endpoints/EndpointsCtrl";
import {serverFilter} from "./nodes/filters/ServerGroupFilter";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerGroup} from "../../services/server-group/IServerGroup";
import {IRedirectState} from "../../common/IRedirectState";
import {EndpointService} from "../../services/endpoint/EndpointService";
import {endpointFilter} from "./endpoints/filters/EndpointFilter";
import {DomainService} from "../../services/domain/DomainService";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";

const module: ng.IModule = App.module("managementConsole.server-group", []);

module.controller("ServerGroupCtrl", ServerGroupCtrl);
module.filter("serverFilter", serverFilter);
module.filter("endpointFilter", endpointFilter);

module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("server-group", <IRedirectState>{
    parent: "root",
    url: "server-groups/:serverGroup",
    templateUrl: "module/server-group/view/server-group.html",
    controller: ServerGroupCtrl,
    controllerAs: "ctrl",
    redirectTo: "server-group.nodes",
    resolve: {
      serverGroup: ["$stateParams", "serverGroupService", ($stateParams, serverGroupService) => {
        return serverGroupService.getServerGroupMapWithMembers($stateParams.serverGroup);
      }],
      available: ["serverGroupService", "serverGroup",
        (serverGroupService: ServerGroupService, serverGroup: IServerGroup) => {
          return serverGroupService.isGroupAvailable(serverGroup);
        }],
      status: ["serverGroupService", "serverGroup",
        (serverGroupService: ServerGroupService, serverGroup: IServerGroup) => {
          return serverGroupService.getServerGroupStatus(serverGroup);
        }],
      hosts: ["domainService", "launchType", (domainService: DomainService, launchType: LaunchTypeService) => {
        if (launchType.isDomainMode()) {
          return domainService.getHosts();
        } else {
          return []; // no hosts for standalone mode
        }
      }]
    }
  });
  $stateProvider.state("server-group.nodes", {
    url: "/nodes",
    templateUrl: "module/server-group/nodes/view/server-group.html"
  });

  $stateProvider.state("server-group.endpoints", {
    url: "/endpoints",
    controller: EndpointsCtrl,
    controllerAs: "ctrl",
    templateUrl: "module/server-group/endpoints/view/endpoints.html",
    resolve: {
      endpoints: ["endpointService", "serverGroup",
        (endpointService: EndpointService, serverGroup: IServerGroup) => {
          return endpointService.getAllClusterEndpoints(serverGroup);
        }],
    }
  });
});
