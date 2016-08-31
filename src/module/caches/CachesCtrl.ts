import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {DmrService} from "../../services/dmr/DmrService";
import {IStateService} from "angular-ui-router";
import {ICache} from "../../services/cache/ICache";
import {TraitCheckboxes} from "./filters/CacheTraitFilter";
import {StatusCheckboxes} from "./filters/CacheStatusFilter";
import {TypeCheckboxes} from "./filters/CacheTypeFilter";
import {RebalanceModalCtrl} from "./RebalanceModalCtrl";
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import IModalService = angular.ui.bootstrap.IModalService;

export class CachesCtrl {

  static $inject: string[] = ["$state", "$uibModal", "containerService", "dmrService", "container", "caches"];

  name: string;
  serverGroup: string;
  traitCheckboxes: TraitCheckboxes = new TraitCheckboxes();
  typeCheckboxes: TypeCheckboxes = new TypeCheckboxes();
  statusCheckboxes: StatusCheckboxes = new StatusCheckboxes();
  isCollapsedTrait: boolean = false;
  isCollapsedType: boolean = false;
  isCollapsedStatus: boolean = false;
  isRebalancingEnabled: boolean = false;
  errorExecuting: boolean = false;
  errorDescription: string = "";
  successfulOperation: boolean = false;

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private containerService: ContainerService,
              private dmrService: DmrService,
              public container: ICacheContainer,
              public caches: ICache[]) {
    this.name = container.name;
    this.serverGroup = container.serverGroup.name;
    this.getRebalancingEnabled();
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

  private createRebalanceModal(enableRebalance: boolean, message: string): void {
    let modal: IModalServiceInstance = this.$uibModal.open({
      templateUrl: "module/caches/view/cluster-rebalance-modal.html",
      controller: RebalanceModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        confirmationMessage: (): string => {
          return message;
        }
      }
    });

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

  private getRebalancingEnabled(): void {
    this.containerService.isRebalancingEnabled(this.container).then(enabled => this.isRebalancingEnabled = enabled);
  }
}
