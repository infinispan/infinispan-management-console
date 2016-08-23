import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IMap} from "../utils/IDictionary";
import {UtilsService} from "../utils/UtilsService";

const module: ng.IModule = App.module("managementConsole.services.jgroups", []);

export class JGroupsService {

  static $inject: string[] = ["$q", "dmrService", "utils"];

  constructor(private $q: IQService, private dmrService: DmrService, private utils: UtilsService) {
  }

  getDefaultStack(host: string, server: string): ng.IPromise<string> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", host, "server", server, "subsystem", "datagrid-jgroups"),
      name: "default-stack"
    };
    return this.dmrService.readAttributeAndResolveExpression(request);
  }

  /**
   * TODO
   * This would be much simpler if /profile=profile-name/subsystem=datagrid-jgroups:read-attribute(name=default-stack)
   * was not deprecated and supported resolving expressions.
   */
  getDefaultStackServerGroupDict(host: string): ng.IPromise<IMap<string>> {
    let deferred: ng.IDeferred<IMap<string>> = this.$q.defer<IMap<string>>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", host, "server"),
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
            stackPromises[serverGroup] = this.getDefaultStack(host, serverName);
          }
        }
        return this.$q.all(stackPromises);
      })
      .then((stacks) => {
        let stackDict: IMap<string> = <IMap<string>>{};
        for (let serverGroup in stacks) {
          stackDict[serverGroup] = stacks[serverGroup];
        }
        deferred.resolve(stackDict);
      });
    return deferred.promise;
  }

}

module.service("jGroupsService", JGroupsService);
