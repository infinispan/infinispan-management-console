import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IDomain} from "../../services/domain/IDomain";
import {DomainService} from "../../services/domain/DomainService";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {IMap} from "../../common/utils/IMap";
import {isNotNullOrUndefined, getArraySize} from "../../common/utils/Utils";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";
import {ModalService} from "../../services/modal/ModalService";
import IQService = angular.IQService;
import {IEndpoint} from "../../services/endpoint/IEndpoint";
import {ISocketBinding} from "../../services/socket-binding/ISocketBinding";

export class CacheContainersCtrl {

  static $inject: string[] = ["containerService", "domainService", "jGroupsService", "clusterEventsService", "containers", "launchType", "modalService", "$state", "$q"];

  domain: IDomain;
  stacks: IMap<string>;
  gridEvents: IClusterEvent[] = [];
  rebalancingStatuses: any[] = [];

  constructor(private containerService: ContainerService,
              private domainService: DomainService,
              private jGroupsService: JGroupsService,
              private clusterEventsService: ClusterEventsService,
              public containers: ICacheContainer[],
              private launchType: LaunchTypeService,
              private modalService: ModalService,
              private $state: any,
              private $q: IQService) {
    if (this.jGroupsService.hasJGroupsStack()) {
      this.domainService.getHostsAndServers()
        .then((domain) => {
          this.domain = domain;
          return this.jGroupsService.getDefaultStackServerGroupMap(domain.controller);
        })
        .then((stacks) => this.stacks = stacks);

      this.getAllClusterEvents();
    }

    this.initRebalancingStatuses(this.containers).then(statuses => {
      this.rebalancingStatuses = statuses;
    });
  }

  getContainerId(name: string, container: ICacheContainer): string {
    return container.profile + "." + container.name + "." + name;
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
    return getArraySize(container["sites-online"]) + getArraySize(container["sites-offline"]) +
      getArraySize(container["sites-mixed"]) === 0;
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

  isLocalMode(): boolean {
    return this.launchType.isStandaloneLocalMode();
  }

  enableContainerRebalance(container: any): void {
    this.modalService.createRebalanceModal(true, "ENABLE rebalancing for cache container?", container)
    .then(() => this.$state.reload());
  }

  disableContainerRebalance(container: any): void {
    this.modalService.createRebalanceModal(false, "DISABLE rebalancing for cache container?", container)
    .then(() => this.$state.reload());
  }

  createSiteModal(container: ICacheContainer): void {
    this.modalService.createCachesSiteModal(container);
  }

  displayEndpoint(endpoint: IEndpoint): string {
    let socketBinding: ISocketBinding = endpoint.getSocketBinding();
    if (isNotNullOrUndefined(socketBinding)) {
      return socketBinding.name + " : " + socketBinding.port + " " + (isNotNullOrUndefined(endpoint.getEncryption()) ? "encrypted" : "");
    }
  }

  isMultiTenantRouter(endpoint: IEndpoint): boolean {
    return isNotNullOrUndefined(endpoint) &&
      endpoint.isMultiTenant();
  }

  private initRebalancingStatuses(allContainers: ICacheContainer[]): ng.IPromise<any[]> {
    const defered: any = this.$q.defer<any>();

    const containerPromises: any = allContainers.reduce(this.containerReducerFn(this.containerService), []);

    this.$q.all(containerPromises).then(containerStatuses => {
      const statuses: any = containerStatuses.reduce(this.statusReducerFn(allContainers), []);
      defered.resolve(statuses);
    });

    return defered.promise;
  }

  private containerReducerFn(containerService: any): any {
    return function(acc: any, tally: ICacheContainer): any[] {
      acc.push(containerService.isRebalancingEnabled(tally));
      return acc;
    };
  }

  private statusReducerFn(allContainers: any): any {
    return function(acc: any, tally: boolean, index: number):any[] {
      acc.push({
        profile: allContainers[index].profile,
        status: tally
      });
      return acc;
    };
  }
}
