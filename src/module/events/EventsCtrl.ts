import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {isNotNullOrUndefined} from "../../common/utils/Utils";

export class EventsCtrl {

  static $inject: string[] = ["clusterEventsService", "containers"];

  lineCount: number = 100;
  allPossibleLineCounts: number[] = [100, 500, 1000, 2000, 5000, 10000];
  clusterEvents: IClusterEvent[] = [];

  constructor(private clusterEventsService: ClusterEventsService,
              private containers: ICacheContainer[]) {
    this.refreshClusterEvents();
  }

  refreshClusterEvents(): void {
    for (let container of this.containers) {
      this.clusterEventsService.fetchClusterEvents(container, this.lineCount)
        .then((events) => this.clusterEvents = this.clusterEvents.concat(events));
    }
  }

  getServerOutput(event: IClusterEvent): string {
    if (isNotNullOrUndefined(event.server)) {
      return event.server.host + ": " + event.server.name;
    }
    return "";
  }
}
