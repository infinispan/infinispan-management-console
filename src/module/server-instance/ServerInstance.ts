import {App} from "../../ManagementConsole";
import {ServerInstanceCtrl} from "./ServerInstanceCtrl";
import {ServerAddress} from "../../services/server/ServerAddress";
import {IServerAddress} from "../../services/server/IServerAddress";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {ServerService} from "../../services/server/ServerService";

const module: ng.IModule = App.module("managementConsole.server-instance", []);

module.controller("ServerInstanceCtrl", ServerInstanceCtrl);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("server-instance", {
    parent: "root",
    url: "server-groups/:serverGroupName/:host/:server",
    templateUrl: "module/server-instance/view/server-instance.html",
    controller: ServerInstanceCtrl,
    controllerAs: "ctrl",
    resolve: {
      coord: ["$q", "$stateParams", "serverGroupService", "jGroupsService", "serverService",
        ($q: ng.IQService, $stateParams, serverGroupService: ServerGroupService,
         jGroupsService: JGroupsService, serverService: ServerService) => {
          let deferred: ng.IDeferred<IServerAddress> = $q.defer<IServerAddress>();
          let server: IServerAddress = new ServerAddress($stateParams.host, $stateParams.server);
          serverService.getServerStatus(server).then(status => {
            if (status === "STOPPED") {
              deferred.resolve(new ServerAddress("", ""));
            } else {
              return serverGroupService.getServerGroupMapWithMembers($stateParams.serverGroupName).then(resp => {
                deferred.resolve(jGroupsService.getCoordinatorByServer(server, resp.profile));
              });
            }
          });
          return deferred.promise;
        }],
      serverInstance: ["$stateParams", "serverService", ($stateParams, serverService: ServerService) => {
        return serverService.getServer(new ServerAddress($stateParams.host, $stateParams.server));
      }]
    }
  });
});
