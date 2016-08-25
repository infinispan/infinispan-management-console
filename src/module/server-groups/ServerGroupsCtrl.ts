import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import {UtilsService} from "../../services/utils/UtilsService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {IMap} from "../../services/utils/IMap";
import {IServerGroup} from "../../services/server-group/IServerGroup";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";

export class ServerGroupsCtrl {
  static $inject: string[] = ["clusterEventsService", "serverGroupService", "utils", "containers", "serverGroups"];

  gridEvents: IClusterEvent[] = [];
  status: IMap<string> = {};

  constructor(private clusterEventsService: ClusterEventsService, private serverGroupService: ServerGroupService,
              private utils: UtilsService, public containers: ICacheContainer[],
              public serverGroups: IMap<IServerGroup>) {
    this.getAllClusterEvents();
    this.getAllSGStatuses();
  }

  getSGHostCount(serverGroup: IServerGroup): number {
    return Object.keys(serverGroup.members).length;
  }

  getSGServerCount(serverGroup: IServerGroup): number {
    let count: number = 0;
    for (let host in serverGroup.members) {
      count += serverGroup.members[host].length;
    }
    return count;
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
    this.serverGroupService.areAllServerViewsTheSame(serverGroup)
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
