import {ICacheContainer} from "../../services/container/ICacheContainer";
import {ICache} from "../../services/cache/ICache";
import {CacheService} from "../../services/cache/CacheService";
import {IStateService} from "angular-ui-router";
export class CacheNodesCtrl {
  static $inject: string[] = ["$state", "cacheService", "container", "cache", "allCacheStats"];

  constructor(private $state:IStateService, private cacheService: CacheService, private container:ICacheContainer,
              private cache:ICache, private allCacheStats: any[]) {
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
