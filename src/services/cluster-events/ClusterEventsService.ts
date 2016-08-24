import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {JGroupsService} from "../jgroups/JGroupsService";
import {ICacheContainer} from "../container/ICacheContainer";
import {IClusterEvent} from "./IClusterEvent";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IServerAddress} from "../server/IServerAddress";
import {ServerAddress} from "../server/ServerAddress";

const module: ng.IModule = App.module("managementConsole.services.cluster-events", []);

export class ClusterEventsService {

  static $inject: string[] = ["$q", "dmrService", "jGroupsService"];

  static parseEvent(object: any): IClusterEvent {
    let scopeExists: boolean = object.scope !== undefined;
    let address: string[] = scopeExists ? object.scope.split(":") : [];
    return <IClusterEvent> {
      category: object.category,
      context: object.context,
      level: object.level,
      message: object.message,
      server: !scopeExists ? undefined : new ServerAddress(address[0], address[1]),
      when: object.when
    };
  }

  constructor(private $q: ng.IQService, private dmrService: DmrService, private jGroupsService: JGroupsService) {
  }

  fetchClusterEvents(container: ICacheContainer, maxLines: number): ng.IPromise<IClusterEvent[]> {
    let deferred: ng.IDeferred<IClusterEvent[]> = this.$q.defer<IClusterEvent[]>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then((coordinator) => {
        let server: IServerAddress = new ServerAddress(coordinator.host, coordinator.name);
        return this.getEventLog(server, container.name, maxLines);
      })
      .then((eventLog) => {
        let events: IClusterEvent[] = eventLog.map((event) => ClusterEventsService.parseEvent(event));
        deferred.resolve(events);
      });
    return deferred.promise;
  }

  private getEventLog(server: IServerAddress, container: string, maxLines: number): ng.IPromise<any> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", server.host, "server", server.name, "subsystem", "datagrid-infinispan",
        "cache-container", container),
      lines: maxLines
    };
    return this.dmrService.readEventLog(request);
  }
}

module.service("clusterEventsService", ClusterEventsService);
