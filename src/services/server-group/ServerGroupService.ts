import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IServerGroup} from "./IServerGroup";
import {IMap} from "../utils/IDictionary";
import IQService = angular.IQService;

const module: ng.IModule = App.module("managementConsole.services.server-group", []);

export class ServerGroupService {

  static $inject: string[] = ["$q", "dmrService"];

  static parseServerGroup(name: string, object: any, members?: string[]): IServerGroup {
    return <IServerGroup> {
      name: name,
      profile: object.profile,
      "socket-binding-group": object["socket-binding-group"],
      "socket-binding-port-offset": object["socket-binding-port-offset"],
      members: (members != null && members !== undefined) ? members : []
    };
  }

  constructor(private $q: IQService, private dmrService: DmrService) {
  }

  getServerGroupMap(): ng.IPromise<IMap<IServerGroup>> {
    let request: IDmrRequest = <IDmrRequest> {
      address: [],
      "child-type": "server-group"
    };

    let deferred: ng.IDeferred<IMap<IServerGroup>> = this.$q.defer<IMap<IServerGroup>>();
    this.dmrService.readChildResources(request).then((serverGroups: any) => {
      let dict: IMap<IServerGroup> = <IMap<IServerGroup>>{};
      for (let serverGroupName in serverGroups) {
        let serverGroup: any = serverGroups[serverGroupName];
        dict[serverGroupName] = ServerGroupService.parseServerGroup(serverGroupName, serverGroup);
      }
      deferred.resolve(dict);
    });
    return deferred.promise;
  }

  getServerGroupMapWithMembers(): ng.IPromise<IMap<IServerGroup>> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [],
      "child-type": "host",
      "recursive-depth": 1
    };

    let deferred: ng.IDeferred<IMap<IServerGroup>> = this.$q.defer<IMap<IServerGroup>>();
    this.getServerGroupMap()
      .then((map) => {
        this.dmrService.readChildResources(request).then((response) => {
          for (let host in response) {
            let serverConfig: any = host["server-config"];
            for (let server in serverConfig) {
              let serverGroup: string = serverConfig[server].group;
              map[serverGroup].members.push(server);
            }
          }
          deferred.resolve(map);
        });
      });
    return deferred.promise;
  }

  getServerGroupByProfile(profile: string): ng.IPromise<IServerGroup> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [],
      "child-type": "server-group"
    };
    let deferred: ng.IDeferred<IServerGroup> = this.$q.defer<IServerGroup>();
    this.getServerGroupMapWithMembers().then((sgMap) => {
      this.dmrService.readChildResources(request).then((serverGroups: any) => {
        for (let serverGroupName in serverGroups) {
          let serverGroup: any = sgMap[serverGroupName];
          if (serverGroup.profile === profile) {
            deferred.resolve(serverGroup);
            return;
          }
        }
      });
    });
    return deferred.promise;
  }

}

module.service("serverGroupService", ServerGroupService);
