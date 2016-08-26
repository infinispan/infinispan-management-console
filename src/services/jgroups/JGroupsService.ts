import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IMap} from "../utils/IMap";
import {UtilsService} from "../utils/UtilsService";
import {IServerGroup} from "../server-group/IServerGroup";
import {IServerAddress} from "../server/IServerAddress";
import {ServerAddress} from "../server/ServerAddress";
import IQService = angular.IQService;

const module: ng.IModule = App.module("managementConsole.services.jgroups", []);

export class JGroupsService {

  static $inject: string[] = ["$q", "dmrService", "utils"];

  constructor(private $q: IQService, private dmrService: DmrService, private utils: UtilsService) {
  }

  getDefaultStack(server: IServerAddress): ng.IPromise<string> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", server.host, "server", server.name, "subsystem", "datagrid-jgroups"),
      name: "default-stack"
    };
    return this.dmrService.readAttributeAndResolveExpression(request);
  }

  /**
   * TODO
   * This would be much simpler if /profile=profile-name/subsystem=datagrid-jgroups:read-attribute(name=default-stack)
   * was not deprecated and supported resolving expressions.
   */
  getDefaultStackServerGroupMap(host: string): ng.IPromise<IMap<string>> {
    let deferred: ng.IDeferred<IMap<string>> = this.$q.defer<IMap<string>>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", host),
      "child-type": "server"
    };
    this.dmrService.readChildResources(request)
      .then((response) => {
        // Iterate all servers and map their server group to the server name.
        // No need for duplicates, only one server per group is required.
        let stackPromises: IMap<ng.IPromise<string>> = {};
        for (let serverName in response) {
          let serverGroup: string = response[serverName]["server-group"];
          // We only need to receive the stack once per server-group
          if (this.utils.isNullOrUndefined(stackPromises[serverGroup])) {
            stackPromises[serverGroup] = this.getDefaultStack(new ServerAddress(host, serverName));
          }
        }
        return this.$q.all(stackPromises);
      })
      .then((stacks) => {
        let stackMap: IMap<string> = <IMap<string>>{};
        for (let serverGroup in stacks) {
          stackMap[serverGroup] = stacks[serverGroup];
        }
        deferred.resolve(stackMap);
      });
    return deferred.promise;
  }

  getServerGroupCoordinator(serverGroup: IServerGroup): ng.IPromise<IServerAddress> {
    return this.getCoordinatorByServer(serverGroup.members[0], serverGroup.profile);
  }

  getCoordinatorByServer(server: IServerAddress, profile: string): ng.IPromise<IServerAddress> {
    let deferred: ng.IDeferred<IServerAddress> = this.$q.defer<IServerAddress>();
    this.getChannelNamesByProfile(profile)
      .then((channelNames) => {
        return this.getChannelCoordinator(server, channelNames[0]);
      })
      .then((view: string): void => {
        let coordinator: IServerAddress = this.extractAddressFromView(view);
        deferred.resolve(coordinator);
      });
    return deferred.promise;
  }

  getChannelNamesByProfile(profile: string): ng.IPromise<string[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("profile", profile, "subsystem", "datagrid-jgroups"),
      "child-type": "channel"
    };
    return this.dmrService.readChildName(request);
  }

  getChannelCoordinator(server: IServerAddress, channel: string): ng.IPromise<string> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", server.host, "server", server.name, "subsystem", "datagrid-jgroups", "channel", channel,
        "protocol", "pbcast.GMS"),
      name: "view"
    };
    return this.dmrService.readAttribute(request);
  }

  private extractAddressFromView(view: string): IServerAddress {
    let lastIndex: number = view.indexOf("|");
    let hostServerSplitIndex: number = view.indexOf(":");
    let host: string = view.substring(1, hostServerSplitIndex);
    let server: string = view.substring(hostServerSplitIndex + 1, lastIndex);
    let coordinatorAddress: IServerAddress = new ServerAddress(host, server);
    return coordinatorAddress;
  }

}

module.service("jGroupsService", JGroupsService);
