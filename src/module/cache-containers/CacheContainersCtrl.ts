import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IDomain} from "../../services/domain/IDomain";
import {DomainService} from "../../services/domain/DomainService";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {IMap} from "../../common/utils/IMap";
import {isNotNullOrUndefined, getArraySize} from "../../common/utils/Utils";

export class CacheContainersCtrl {

  static $inject: string[] = ["containerService", "domainService", "jGroupsService", "clusterEventsService", "containers"];

  domain: IDomain;
  stacks: IMap<string>;
  gridEvents: IClusterEvent[] = [];

  constructor(private containerService: ContainerService,
              private domainService: DomainService,
              private jGroupsService: JGroupsService,
              private clusterEventsService: ClusterEventsService,
              public containers: ICacheContainer[]) {
    if (this.jGroupsService.hasJGroupsStack()) {
      this.domainService.getHostsAndServers()
        .then((domain) => {
          this.domain = domain;
          return this.jGroupsService.getDefaultStackServerGroupMap(domain.controller);
        })
        .then((stacks) => this.stacks = stacks);

      this.getAllClusterEvents();
    }
  }

  getDefaultStack(container: ICacheContainer): string {
    if (isNotNullOrUndefined(this.stacks)) {
      let serverGroup: string = container.serverGroup.name;
      return this.stacks[serverGroup];
    }
    return "";
  }

  getAvailabilityClass(container: ICacheContainer): string {
    return container.available ? "label-success" : "label-danger";
  }

  getAvailability(container: ICacheContainer): string {
    return container.available ? "AVAILABLE" : "DEGRADED";
  }

  isSitesEmpty(container: ICacheContainer): boolean {
    return getArraySize(container["online-sites"]) + getArraySize(container["offline-sites"]) +
      getArraySize(container["mixed-sites"]) === 0;
  }

  getAllClusterEvents(): void {
    for (let container of this.containers) {
      this.clusterEventsService.fetchClusterEvents(container, 10)
        .then((events) => this.gridEvents = this.gridEvents.concat(events));
    }
  }

  isStandaloneLocalMode(): boolean {
    return !this.jGroupsService.hasJGroupsStack();
  }
}
