import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {IServerGroup} from "../../services/server-group/IServerGroup";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerAddress} from "../../services/server/IServerAddress";
import {IMap} from "../../common/utils/IMap";

export class ServerGroupsCtrl {
  static $inject: string[] = ["clusterEventsService", "serverGroupService", "containers", "serverGroups"];

  gridEvents: IClusterEvent[] = [];
  status: IMap<string> = {};

  constructor(private clusterEventsService: ClusterEventsService,
              private serverGroupService: ServerGroupService,
              public containers: ICacheContainer[],
              public serverGroups: IMap<IServerGroup>) {
    this.getAllClusterEvents();
    this.getAllSGStatuses();
  }

  getSGHostCount(serverGroup: IServerGroup): number {
    let members: IServerAddress[] = serverGroup.members;
    if (members.length > 1) {
      let hostCount: number = 1;
      let host: string = members[0].host;
      for (let server of members) {
        if (server.host !== host) {
          hostCount++;
          host = server.host;
        }
      }
      return hostCount;
    }
    return members.length;
  }

  getSGServerCount(serverGroup: IServerGroup): number {
    return serverGroup.members.length;
  }

  getSGStatus(serverGroup: IServerGroup): string {
    return this.status[serverGroup.name];
  }

  getSGStatusClass(serverGroup: IServerGroup): string {
    return this.status[serverGroup.name] === "STARTED" ? "label-success" : "label-danger";
  }

  private getAllSGStatuses(): void {
    for (let serverGroup in this.serverGroups) {
      this.setSGStatus(this.serverGroups[serverGroup]);
    }
  }

  private setSGStatus(serverGroup: IServerGroup): void {
    this.serverGroupService.isGroupAvailable(serverGroup)
      .then((result) => {
        if (result) {
          this.status[serverGroup.name] = "STARTED";
        } else {
          this.status[serverGroup.name] = "DEGRADED";
        }
      });
  }

  private getAllClusterEvents(): void {
    for (let container of this.containers) {
      this.clusterEventsService.fetchClusterEvents(container, 10)
        .then((events) => this.gridEvents = this.gridEvents.concat(events));
    }
  }
}
