import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {DmrService} from "../../services/dmr/DmrService";
import {IStateService} from "angular-ui-router";
import IModalService = angular.ui.bootstrap.IModalService;
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";
import {ModalService} from "../../services/modal/ModalService";

export class CacheContainerCtrl {

  static $inject: string[] = ["$state", "$uibModal", "containerService", "dmrService", "launchType", "container", "isRebalancingEnabled", "modalService"];

  name: string;
  serverGroup: string;
  errorExecuting: boolean = false;
  errorDescription: string = "";
  successfulOperation: boolean = false;

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private containerService: ContainerService,
              private dmrService: DmrService,
              private launchType: LaunchTypeService,
              public container: ICacheContainer,
              public isRebalancingEnabled: boolean,
              private modalService: ModalService) {
    this.name = container.name;
    this.serverGroup = container.serverGroup.name;
  }

  refresh(): void {
    this.dmrService.clearGetCache();
    this.$state.reload();
  }

  getAvailability(): string {
    return this.container.available ? "AVAILABLE" : "DEGRADED";
  }

  enableContainerRebalance(): void {
    this.createRebalanceModal(true, "ENABLE rebalancing for cache container?");
  }

  disableContainerRebalance(): void {
    this.createRebalanceModal(false, "DISABLE rebalancing for cache container?");
  }

  isLocalMode(): boolean {
    return this.launchType.isStandaloneLocalMode();
  }

  createSiteModal(): void {
    this.modalService.createCachesSiteModal(this.container);
  }

  private createRebalanceModal(enableRebalance: boolean, message: string): void {
    this.modalService.createRebalanceModal(enableRebalance, message, this.container).then(() => {
        this.successfulOperation = true;
        this.isRebalancingEnabled = enableRebalance;
        this.errorDescription = "";
      }, error => {
        this.errorExecuting = true;
        this.errorDescription = error;
      });
  }
}
