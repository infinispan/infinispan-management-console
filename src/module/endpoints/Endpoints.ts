import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {EndpointConfigCtrl} from "./../endpoints/config/EndpointConfigCtrl";
import {EndpointsCtrl} from "../server-group/endpoints/EndpointsCtrl";

const module: ng.IModule = App.module("managementConsole.endpoints", []);
module.controller("EndpointsCtrl", EndpointsCtrl);

module.config(($stateProvider: ng.ui.IStateProvider) => {

  $stateProvider.state("edit-endpoint-config", {
    parent: "root",
    url: "endpoints/:profile/:endpointType/:endpointName/config",
    controller: EndpointConfigCtrl,
    controllerAs: "ctrl",
    templateUrl: "module/endpoints/config/view/endpoint-config.html",
    resolve: {
      endpoint: ["$stateParams", "endpointService", ($stateParams, endpointService) => {
        return endpointService.getEndpoint($stateParams.profile, $stateParams.endpointType, $stateParams.endpointName);
      }],
      endpointMeta: ["$stateParams", "endpointService", ($stateParams, endpointService) => {
        return endpointService.getConfigurationMeta($stateParams.profile, $stateParams.endpointType, $stateParams.endpointType);
      }],
      serverGroup: ["$stateParams", "serverGroupService", ($stateParams, serverGroupService) => {
        return serverGroupService.getServerGroupByProfile($stateParams.profile);
      }],
      endpointName: ["$stateParams", ($stateParams) => $stateParams.endpointName],
      endpointType: ["$stateParams", ($stateParams) => $stateParams.endpointType]
    }
  });

  $stateProvider.state("new-endpoint-config", {
    parent: "root",
    url: "endpoints/:profile/:endpointType/:endpointName/new",
    controller: EndpointConfigCtrl,
    controllerAs: "ctrl",
    templateUrl: "module/endpoints/config/view/endpoint-config.html",
    resolve: {
      endpoint: ["$stateParams", "endpointService", ($stateParams, endpointService) => {
        return endpointService.createEndpoint([].concat($stateParams.endpointType).concat($stateParams.endpointName));
      }],
      endpointMeta: ["$stateParams", "endpointService", ($stateParams, endpointService) => {
        return endpointService.getConfigurationMeta($stateParams.profile, $stateParams.endpointType, $stateParams.endpointType);
      }],
      serverGroup: ["$stateParams", "serverGroupService", ($stateParams, serverGroupService) => {
        return serverGroupService.getServerGroupByProfile($stateParams.profile);
      }],
      endpointName: ["$stateParams", ($stateParams) => $stateParams.endpointName],
      endpointType: ["$stateParams", ($stateParams) => $stateParams.endpointType]
    }
  });
});
