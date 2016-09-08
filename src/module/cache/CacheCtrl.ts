import {openConfirmationModal} from "../../common/dialogs/Modals";
import {IIntervalService} from "angular";
import {IStateService} from "angular-ui-router";
import {CacheService} from "../../services/cache/CacheService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {ICache} from "../../services/cache/ICache";
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import IModalService = angular.ui.bootstrap.IModalService;

export class CacheCtrl {
  static $inject: string[] = ["$state", "$interval", "$uibModal", "cacheService", "container", "cache", "stats", "cacheEnabledRSP"];

  private cacheEnabled: boolean;
  constructor(private $state: IStateService, private $interval: IIntervalService,
              private $uibModal: IModalService, private cacheService: CacheService,
              private container: ICacheContainer, private cache: ICache, private stats: any, private cacheEnabledRSP: any) {
    this.cacheEnabled = !cacheEnabledRSP[cache.name];
  }

  createEnableModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal,
      "Enabling cache " + this.cache.name + " will attach it to all active remote endpoints. Enable?");
    modal.result.then(() => {
      this.cacheService.enable(this.container.profile, this.cache).then((result) => {
        this.cacheEnabled = true;
      }).finally(() => {
        this.refresh();
      });
    });
  }

  createDisableModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal,
      "Disabling cache " + this.cache.name + " will detach it from all active remote endpoints. Disable?");
    modal.result.then(() => {
      this.cacheService.disable(this.container.profile, this.cache).then((result) => {
        this.cacheEnabled = false;
      }).finally(() => {
        this.refresh();
      });
    });
  }

  createFlushModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal,
      "Flushing cache " + this.cache.name + " will passivate all its cache entries. Flush?");
    modal.result.then(() => {
      this.cacheService.flushCache(this.container, this.cache).finally(() => {
        this.refresh();
      });
    });
  }

  createReindexModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal,
      "Re-indexing cache " + this.cache.name + " will remove its current index and recreate it according to the cache contents' schema. Re-index?");
    modal.result.then(() => {
      this.cacheService.indexCache(this.container, this.cache).finally(() => {
        this.refresh();
      });
    });
  }

  createClearModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal,
      "Clearing cache " + this.cache.name + " will remove all of its cache entries both from memory and from any associated persistent stores. Clear?");
    modal.result.then(() => {
      this.cacheService.clearCache(this.container, this.cache).finally(() => {
        this.refresh();
      });
    });
  }

  createEnableRebalancingModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal,
      "Enabling rebalancing of " + this.cache.name + " will automatically redistribute data across the cluster when nodes are added/removed. Enable rebalancing?");
    modal.result.then(() => {
      this.cacheService.setRebalance(this.container, this.cache, true).finally(() => {
        this.refresh();
      });
    });
  }

  createDisableRebalancingModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal,
      "Disabling rebalancing of " + this.cache.name + " will NOT automatically redistribute data across the cluster when nodes are added/removed. Disable rebalancing?");
    modal.result.then(() => {
      this.cacheService.setRebalance(this.container, this.cache, false).finally(() => {
        this.refresh();
      });
    });
  }

  currentCacheAvailability(): boolean {
    return this.container.available;
  }

  currentClusterAvailabilityAsString(): string {
    return this.container.available ? "AVAILABLE" : "N/A";
  }

  resetStats(): void {
    this.cacheService.resetStats(this.container, this.cache).finally(() => {
      this.refresh();
    });
  }

  refresh(): void {
    this.$state.reload();
  }
}
