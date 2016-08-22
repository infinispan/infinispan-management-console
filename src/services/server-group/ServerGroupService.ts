import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import IQService = angular.IQService;
import {IServerGroup} from "./IServerGroup";

const module: ng.IModule = App.module("managementConsole.services.server-group", []);

export class ServerGroupService {

  static $inject: string[] = ["$q", "dmrService"];

  static parseServerGroup(name: string, object: any): IServerGroup {
    return <IServerGroup> {
      name: name,
      profile: object.profile,
      "socket-binding-group": object["socket-binding-group"],
      "socket-binding-port-offset": object["socket-binding-port-offset"]
    };
  }

  constructor(private $q: IQService, private dmrService: DmrService) {}

  getServerGroupByProfile(profile: string): ng.IPromise<IServerGroup> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [],
      "child-type": "server-group"
    };
    let deferred: ng.IDeferred<IServerGroup> = this.$q.defer<IServerGroup>();
    this.dmrService.readChildResources(request).then((serverGroups: any) => {
      for (let serverGroupName in serverGroups) {
        let serverGroup: any = serverGroups[serverGroupName];
        if (serverGroup.profile === profile) {
          deferred.resolve(ServerGroupService.parseServerGroup(serverGroupName, serverGroup));
          return;
        }
      }
    });
    return deferred.promise;
  }
}

module.service("serverGroupService", ServerGroupService);
