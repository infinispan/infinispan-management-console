import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {DmrService} from "../../services/dmr/DmrService";
import {IStateService} from "angular-ui-router";
import {SiteManagementModalCtrl} from "./SiteManagementModalCtrl";
import {openConfirmationModal} from "../../common/dialogs/Modals";
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import IModalService = angular.ui.bootstrap.IModalService;
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";

export class CacheContainerCtrl {

  static $inject: string[] = ["$state", "$uibModal", "containerService", "dmrService", "launchType", "container", "isRebalancingEnabled"];

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
              public isRebalancingEnabled: boolean) {
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
    this.$uibModal.open({
      templateUrl: "module/cache-container/view/manage-sites-modal.html",
      controller: SiteManagementModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => {
          return this.container;
        },
        siteArrays: (): ng.IPromise<{[id: string]: string[]}> => {
          return this.containerService.getSiteArrays(this.container);
        }
      },
      size: "lg"
    });
  }

  private createRebalanceModal(enableRebalance: boolean, message: string): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal, message);
    modal.result.then(() => {
      let promise: ng.IPromise<void> = enableRebalance ? this.containerService.enableRebalance(this.container) :
        this.containerService.disableRebalance(this.container);

      promise.then(() => {
        this.successfulOperation = true;
        this.isRebalancingEnabled = enableRebalance;
        this.errorDescription = "";
      }, error => {
        this.errorExecuting = true;
        this.errorDescription = error;
      });
    });
  }
}
