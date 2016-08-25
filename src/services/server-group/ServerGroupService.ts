import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IServerGroup} from "./IServerGroup";
import {IMap} from "../utils/IMap";
import {UtilsService} from "../utils/UtilsService";
import IQService = angular.IQService;
import {ServerAddress} from "../server/ServerAddress";
import {DomainService} from "../domain/DomainService";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerAddress} from "../server/IServerAddress";
import {IServerGroupMembers} from "./IServerGroupMembers";

const module: ng.IModule = App.module("managementConsole.services.server-group", []);

export class ServerGroupService {

  static $inject: string[] = ["$q", "dmrService", "domainService", "jGroupsService", "utils"];

  static parseServerGroup(name: string, object: any, members?: IMap<string[]>): IServerGroup {
    return <IServerGroup> {
      name: name,
      profile: object.profile,
      "socket-binding-group": object["socket-binding-group"],
      "socket-binding-port-offset": object["socket-binding-port-offset"],
      members: (members != null && members !== undefined) ? members : {}
    };
  }

  constructor(private $q: IQService, private dmrService: DmrService, private domainService: DomainService,
              private jGroupsService: JGroupsService, private utils: UtilsService) {
  }

  getServerGroupMap(): ng.IPromise<IMap<IServerGroup>> {
    let request: IDmrRequest = <IDmrRequest> {
      address: [],
      "child-type": "server-group"
    };

    let deferred: ng.IDeferred<IMap<IServerGroup>> = this.$q.defer<IMap<IServerGroup>>();
    this.dmrService.readChildResources(request).then((serverGroups: any) => {
      let map: IMap<IServerGroup> = <IMap<IServerGroup>>{};
      for (let serverGroupName in serverGroups) {
        let serverGroup: any = serverGroups[serverGroupName];
        map[serverGroupName] = ServerGroupService.parseServerGroup(serverGroupName, serverGroup);
      }
      deferred.resolve(map);
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
          // Iterate all hosts and servers, populating allServerGroups map as we go
          for (let host in response) {
            let serverConfig: any = response[host]["server-config"];
            for (let server in serverConfig) {
              let serverGroupName: string = serverConfig[server].group;
              let serverGroup: IServerGroup = map[serverGroupName];
              if (this.utils.isNullOrUndefined(serverGroup.members[host])) {
                serverGroup.members[host] = [];
              }
              serverGroup.members[host].push(server);
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

  areAllServerViewsTheSame(serverGroup: IServerGroup): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    let promises: ng.IPromise<IServerAddress>[] = [];
    let members: IServerGroupMembers = serverGroup.members;
    for (let host in members) {
      for (let server of members[host]) {
        promises.push(this.jGroupsService.getCoordinatorByServer(new ServerAddress(host, server), serverGroup.profile));
      }
    }

    this.$q.all(promises).then((views: [IServerAddress]) => {
      if (views.length === 1) {
        deferred.resolve(true);
        return;
      }
      let firstView: IServerAddress = views[0];
      deferred.resolve(views.every((view) => firstView.equals(view)));
    });
    return deferred.promise;
  }

}

module.service("serverGroupService", ServerGroupService);
