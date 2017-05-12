import {deepGet, capitalizeFirstLetter} from "../../common/utils/Utils";
import {openConfirmationModal} from "../../common/dialogs/Modals";
import {ServerService} from "../../services/server/ServerService";
import {IServerAddress} from "../../services/server/IServerAddress";
import {IServer} from "../../services/server/IServer";
import {IIntervalService} from "angular";
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import IModalService = angular.ui.bootstrap.IModalService;
import {IStateService} from "angular-ui-router";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";

export class ServerInstanceCtrl {
  static $inject: string[] = ["$state", "$interval", "$uibModal", "serverService", "coord", "serverInstance", "launchType"];

  public config: any;
  public data: any;
  public chartHeight: any;
  public label: string;

  private threadCount: number;
  private threadPeakCount: number;
  private threadDaemonCount: number;

  private directBufferPoolCount: number;
  private directBufferPoolMemoryUsed: number;

  private mappedBufferPoolCount: number;
  private mappedBufferPoolMemoryUsed: number;

  private nodeStats: any;

  constructor(private $state: IStateService, private $interval: IIntervalService, private $uibModal: IModalService,
              private serverService: ServerService, private coord: IServerAddress, private serverInstance: IServer,
              private launchType: LaunchTypeService) {
    this.$interval(() => (this.refreshStats()), 500, 1);
    this.chartHeight = 200;
    this.label = "percent";
    this.data = {
      dataAvailable: false,
      used: 0,
      total: 0
    };
    this.config = {
      chartId: "heapMemoryStats",
      units: "Heap Memory",
      thresholds: { warning: 60, error: 90 }
    };
  }

  refreshStats(): void {
    let server: IServerAddress = this.serverInstance.address;
    this.fetchThreadAndMemoryStats(server);
    this.fetchAggregateNodeStats(server);
  }

  fetchThreadAndMemoryStats(address: IServerAddress): void {
    this.serverService.getServerStats(address).then(response => {
      // memory
      const memory: any = response.memory["heap-memory-usage"];
      const used: number = (memory.used / 1024) / 1024;
      const max: number = (memory.max / 1024) / 1024;

      // threading
      let threading: any = response.threading;
      this.threadCount = threading["thread-count"];
      this.threadPeakCount = threading["peak-thread-count"];
      this.threadDaemonCount = threading["daemon-thread-count"];

      let directBufferPool: any = deepGet(response, "buffer-pool.name.direct");
      let mappedBufferPool: any = deepGet(response, "buffer-pool.name.mapped");

      this.directBufferPoolCount = directBufferPool.count;
      this.directBufferPoolMemoryUsed = directBufferPool["memory-used"];

      this.mappedBufferPoolCount = mappedBufferPool.count;
      this.mappedBufferPoolMemoryUsed = mappedBufferPool["memory-used"];

      this.data = {
        dataAvailable: true,
        used: Math.ceil(used),
        total: Math.ceil(max)
      };
    });
  }

  fetchAggregateNodeStats(address: IServerAddress): void {

    this.serverService.getAggregateNodeStats(address).then(response => {
      // TODO here we need to loop through all cache containers and add all stats up
      // but for now just use the first container found
      let containersRoot: any = response["cache-container"];
      for (var prop in containersRoot) {
        this.nodeStats = containersRoot[prop];
        break;
      }
    });
  }

  isCoordinator(): boolean {
    return this.serverInstance.address.host === this.coord.host && this.serverInstance.address.name === this.coord.name;
  };

  createStartModal(server: IServer): void {

    let actionRequired: string = this.getActionRequired(server);
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal, capitalizeFirstLetter(actionRequired) +
      " server " + this.serverInstance.address.name + "?");
    modal.result.then(() => {
      let promise: ng.IPromise<string> = this.serverService.executeServerOp(this.serverInstance.address, actionRequired);
      promise.then(() => this.refresh());
    });
  }

  createStopModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal, "Stop server " + this.serverInstance.address.name + "?");
    modal.result.then(() => {
      let promise: ng.IPromise<string> = this.serverService.stopServer(this.serverInstance.address);
      promise.then(() => this.refresh());
    });
  }

  createRemoveModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal, "Remove server " +
      this.serverInstance.address.name + "?");
    modal.result.then(() => {
      let promise: ng.IPromise<string> = this.serverService.removeServer(this.serverInstance.address);
      promise.then(() => this.goToClustersView());
    });
  }

  goToClustersView(): void {
    this.$state.go("server-groups", {});
  }

  isDomainMode(): boolean {
    return this.launchType.isDomainMode();
  }

  private getActionRequired(serverState: IServer): string {
    let actionRequired: string;
    if (serverState.isStopped()) {
      actionRequired = "start";
    } else if (serverState.isRestartRequired()) {
      actionRequired = "restart";
    } else if (serverState.isReloadRequired()) {
      actionRequired = "reload";
    }
    return actionRequired;
  }

  private refresh(): void {
    this.$state.reload();
    this.refreshStats();
  }
}
