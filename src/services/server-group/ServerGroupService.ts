import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IServerGroup} from "./IServerGroup";
import {ServerAddress} from "../server/ServerAddress";
import {DomainService} from "../domain/DomainService";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerAddress} from "../server/IServerAddress";
import {ServerService} from "../server/ServerService";
import IQService = angular.IQService;
import {IMap} from "../../common/utils/IMap";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {StandaloneService} from "../standalone/StandaloneService";

const module: ng.IModule = App.module("managementConsole.services.server-group", []);

export class ServerGroupService {

  static $inject: string[] = ["$q", "dmrService", "domainService", "jGroupsService", "serverService", "launchType"];

  static parseServerGroup(name: string, object: any, members?: IServerAddress[]): IServerGroup {
    return <IServerGroup> {
      name: name,
      profile: object.profile,
      "socket-binding-group": object["socket-binding-group"],
      "socket-binding-port-offset": object["socket-binding-port-offset"],
      members: (members != null && members !== undefined) ? members : []
    };
  }

  constructor(private $q: IQService,
              private dmrService: DmrService,
              private domainService: DomainService,
              private jGroupsService: JGroupsService,
              private serverService: ServerService,
              private launchType: LaunchTypeService) {
  }

  getAllServerGroupsMap(): ng.IPromise<IMap<IServerGroup>> {
    if (this.launchType.isDomainMode()) {
      return this.getAllServerGroupsMapDomain();
    } else if (this.launchType.isStandaloneMode()) {
      return this.getAllServerGroupsMapStandalone();
    }
  }

  getAllServerGroupsMapDomain(): ng.IPromise<IMap<IServerGroup>> {
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

  getAllServerGroupsMapStandalone(): ng.IPromise<IMap<IServerGroup>> {
    let deferred: ng.IDeferred<IMap<IServerGroup>> = this.$q.defer<IMap<IServerGroup>>();
    let map: IMap<IServerGroup> = <IMap<IServerGroup>>{};
    map[StandaloneService.SERVER_GROUP] = <IServerGroup> {
      name: StandaloneService.SERVER_GROUP,
      profile: StandaloneService.PROFILE_NAME,
      "socket-binding-group": "standard-sockets",
      "socket-binding-port-offset": 0,
      members: []
    };
    deferred.resolve(map);
    return deferred.promise;
  }

  getAllServerGroupsMapWithMembers(): ng.IPromise<IMap<IServerGroup>> {
    if (this.launchType.isDomainMode()) {
      return this.getAllServerGroupsMapWithMembersDomain();
    } else if (this.launchType.isStandaloneMode()) {
      return this.getAllServerGroupsMapWithMembersStandalone();
    }
  }

  getAllServerGroupsMapWithMembersDomain(): ng.IPromise<IMap<IServerGroup>> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [],
      "child-type": "host",
      "recursive-depth": 1
    };

    let deferred: ng.IDeferred<IMap<IServerGroup>> = this.$q.defer<IMap<IServerGroup>>();
    this.getAllServerGroupsMap()
      .then((map) => {
        this.dmrService.readChildResources(request).then((response) => {
          // Iterate all hosts and servers, populating allServerGroups map as we go
          for (let host in response) {
            let serverConfig: any = response[host]["server-config"];
            for (let server in serverConfig) {
              let serverGroupName: string = serverConfig[server].group;
              let serverGroup: IServerGroup = map[serverGroupName];
              serverGroup.members.push(new ServerAddress(host, server));
            }
          }
          deferred.resolve(map);
        });
      });
    return deferred.promise;
  }

  getAllServerGroupsMapWithMembersStandalone(): ng.IPromise<IMap<IServerGroup>> {
    let deferred: ng.IDeferred<IMap<IServerGroup>> = this.$q.defer<IMap<IServerGroup>>();
    this.getStandaloneCacheContainerNames().then((containers: string[]) => {
      this.serverService.getServerView(null, containers[0]).then((view: string []) => {
        this.getAllServerGroupsMap()
          .then((map) => {
            let serverGroup: IServerGroup = map[StandaloneService.SERVER_GROUP];
            for (let member of view) {
              serverGroup.members.push(new ServerAddress(member, member));
            }
            deferred.resolve(map);
          });
      });
    });
    return deferred.promise;
  }

  getStandaloneCacheContainerNames(): ng.IPromise<string[]> {
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    let request: IDmrRequest = <IDmrRequest>{
      address: ["subsystem", "datagrid-infinispan"],
      "child-type": "cache-container"
    };
    this.dmrService.readChildResources(request)
      .then((containers) => {
        let containerNames: string[] = [];
        for (let container in containers) {
          containerNames.push(container);
        }
        deferred.resolve(containerNames);
      });
    return deferred.promise;
  }

  // Here we just wrap the getAll.. methods as it still requires the same number of http requests
  getServerGroupMapWithMembers(serverGroup: string): ng.IPromise<IServerGroup> {
    let deferred: ng.IDeferred<IServerGroup> = this.$q.defer<IServerGroup>();
    this.getAllServerGroupsMapWithMembers().then((serverGroups) => deferred.resolve(serverGroups[serverGroup]));
    return deferred.promise;
  }

  getServerGroupByProfile(profile: string): ng.IPromise<IServerGroup> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [],
      "child-type": "server-group"
    };
    let deferred: ng.IDeferred<IServerGroup> = this.$q.defer<IServerGroup>();
    if (this.launchType.isDomainMode()) {
      this.getAllServerGroupsMapWithMembers().then((sgMap) => {
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
    } else if (this.launchType.isStandaloneMode()) {
      this.getAllServerGroupsMapWithMembers().then((sgMap) => {
        let serverGroup: any = sgMap[StandaloneService.SERVER_GROUP];
        deferred.resolve(serverGroup);
      });
    }
    return deferred.promise;
  }

  // Returns true only if all running servers in the group have the same view and there is at least one running server
  isGroupAvailable(serverGroup: IServerGroup): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    let promises: ng.IPromise<IServerAddress>[] = [];

    this.getRunningServerInstances(serverGroup).then(servers => {
      if (servers.length === 0) {
        deferred.resolve(false);
        return;
      }

      for (let server of servers) {
        promises.push(this.jGroupsService.getCoordinatorByServer(server, serverGroup.profile));
      }

      this.$q.all(promises).then((views: [IServerAddress]) => {
        if (views.length === 1) {
          deferred.resolve(true);
          return;
        }
        let firstView: IServerAddress = views[0];
        deferred.resolve(views.every((view) => firstView.equals(view)));
      });
    });
    return deferred.promise;
  }

  getHostName(): ng.IPromise<string> {
    return this.dmrService.readAttribute(<IDmrRequest>{
      address: [],
      name: "name"
    });
  }

  getRunningServerInstances(serverGroup: IServerGroup): ng.IPromise<IServerAddress[]> {
    let deferred: ng.IDeferred<IServerAddress[]> = this.$q.defer<IServerAddress[]>();
    let promises: ng.IPromise<string>[] = serverGroup.members.map(server => this.serverService.getServerStatus(server));
    this.$q.all(promises).then(statuses => {
      let activeServers: IServerAddress[] = [];
      for (let index in statuses) {
        if (statuses[index] !== "STOPPED") {
          activeServers.push(serverGroup.members[index]);
        }
      }
      deferred.resolve(activeServers);
    });
    return deferred.promise;
  }

  // Can't set IMap key type to anything other than string/number, so we use ServerAddress.toString as key/string
  getServerStatuses(serverGroup: IServerGroup): ng.IPromise<IMap<string>> {
    return this.getStringFromAllMembers(serverGroup, (server) => this.serverService.getServerStatus(server));
  }

  getServerInetAddresses(serverGroup: IServerGroup): ng.IPromise<IMap<string>> {
    return this.getStringFromAllMembers(serverGroup, (server) => this.serverService.getServerInetAddress(server));
  }

  startServers(serverGroup: IServerGroup): ng.IPromise<void> {
    return this.executeOp(serverGroup, "start-servers");
  }

  stopServers(serverGroup: IServerGroup): ng.IPromise<void> {
    return this.executeOp(serverGroup, "stop-servers");
  }

  private executeOp(serverGroup: IServerGroup, operation: string): ng.IPromise<void> {
    return this.dmrService.executePost({
      address: [].concat("server-group", serverGroup.name),
      operation: operation,
      blocking: true
    }, true);
  }

  private getStringFromAllMembers(serverGroup: IServerGroup,
                                  serviceCall: (server: IServerAddress) => ng.IPromise<string>): ng.IPromise<IMap<string>> {
    let deferred: ng.IDeferred<IMap<string>> = this.$q.defer<IMap<string>>();
    let servers: ServerAddress[] = serverGroup.members;
    let promises: ng.IPromise<string>[] = servers.map(serviceCall);

    this.$q.all(promises).then((statuses: string[]) => {
      let statusMap: IMap<string> = {};
      servers.forEach((server) => statusMap[server.toString()] = statuses.shift());
      deferred.resolve(statusMap);
    });
    return deferred.promise;
  }
}

module.service("serverGroupService", ServerGroupService);
