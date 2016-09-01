import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {JGroupsService} from "../jgroups/JGroupsService";
import {ICacheContainer} from "../container/ICacheContainer";
import {IClusterEvent} from "./IClusterEvent";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IServerAddress} from "../server/IServerAddress";
import {ServerAddress} from "../server/ServerAddress";
import {isNotNullOrUndefined, parseServerAddress} from "../../common/utils/Utils";

const module: ng.IModule = App.module("managementConsole.services.cluster-events", []);

export class ClusterEventsService {

  static $inject: string[] = ["$q", "dmrService", "jGroupsService"];

  static parseEvent(object: any): IClusterEvent {
    let scopeExists: boolean = object.scope !== undefined;
    let serverAddress: IServerAddress = scopeExists ? parseServerAddress(object.scope) : undefined;
    return <IClusterEvent> {
      category: object.category,
      context: object.context,
      detail: object.detail,
      level: object.level,
      message: object.message,
      server: serverAddress,
      when: object.when,
      who: object.who
    };
  }

  constructor(private $q: ng.IQService, private dmrService: DmrService, private jGroupsService: JGroupsService) {
  }

  fetchClusterEvents(container: ICacheContainer, maxLines: number, category?: string): ng.IPromise<IClusterEvent[]> {
    let deferred: ng.IDeferred<IClusterEvent[]> = this.$q.defer<IClusterEvent[]>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then((coordinator) => {
          let server: IServerAddress = new ServerAddress(coordinator.host, coordinator.name);
          return this.getEventLog(server, container.name, maxLines, category);
        },
        error => deferred.reject(error))
      .then((eventLog) => {
        let events: IClusterEvent[] = eventLog.map((event) => ClusterEventsService.parseEvent(event));
        deferred.resolve(events);
      });
    return deferred.promise;
  }

  private getEventLog(server: IServerAddress, container: string, maxLines: number, category: string): ng.IPromise<any> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", server.host, "server", server.name, "subsystem", "datagrid-infinispan",
        "cache-container", container),
      lines: maxLines
    };

    if (isNotNullOrUndefined(category)) {
      request.category = category;
    }

    return this.dmrService.readEventLog(request);
  }
}

module.service("clusterEventsService", ClusterEventsService);
