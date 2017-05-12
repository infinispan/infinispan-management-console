import {ICache} from "../../../services/cache/ICache";
import {StatusCheckboxes} from "./filters/CacheStatusFilter";
import {TypeCheckboxes} from "./filters/CacheTypeFilter";
import {TraitCheckboxes} from "./filters/CacheTraitFilter";
import {AddCacheModalCtrl} from "./AddCacheModalCtrl";
import IModalService = angular.ui.bootstrap.IModalService;
import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {ITemplate} from "../../../services/container-config/ITemplate";
import {CacheService} from "../../../services/cache/CacheService";
import {IMap} from "../../../common/utils/IMap";
import {isNullOrUndefined, isNotNullOrUndefined} from "../../../common/utils/Utils";
import {ContainerService} from "../../../services/container/ContainerService";

export class CachesCtrl {
  static $inject: string[] = ["$uibModal", "container", "caches", "templates", "cacheService", "containerService", "$filter"];

  traitCheckboxes: TraitCheckboxes = new TraitCheckboxes();
  typeCheckboxes: TypeCheckboxes = new TypeCheckboxes();
  statusCheckboxes: StatusCheckboxes = new StatusCheckboxes();

  isCollapsedTrait: boolean = false;
  isCollapsedType: boolean = false;
  isCollapsedStatus: boolean = false;
  cacheAvailability: IMap<boolean> = {};
  cacheEnablement: IMap<boolean> = {};

  searchNameQuery: string;
  filteredCaches: ICache[];

  constructor(private $uibModal: IModalService,
              public container: ICacheContainer,
              public caches: ICache[],
              public templates: ITemplate[],
              public cacheService: CacheService,
              private containerService: ContainerService,
              public $filter: any) {

    // query only distributed and replicated caches (local and invalidation don't have availability attribute)
    let cacheToQuery: ICache [] = [];
    for (let cache of caches) {
      if (cache.isLocal() || cache.isInvalidation()) {
        this.cacheAvailability[cache.name] = true;
      } else {
        cacheToQuery.push(cache);
      }
    }

    caches.forEach((cache) => {
      cache.cardStatus = {
        title: cache.name,
        href: "#",
        notifications: [
          {
            "iconClass": (this.calculateNotificationClasses)("fa-database", false),
          },
          {
            "iconClass": (this.calculateNotificationClasses)("fa-stack-overflow", cache.isBounded())
          },
          {
            "iconClass": (this.calculateNotificationClasses)("fa-arrow-circle-o-down", cache.isTransactional())
          },
          {
            "iconClass": (this.calculateNotificationClasses)("fa-lock", cache.isSecured())
          },
          {
            "iconClass": (this.calculateNotificationClasses)("fa-list-ol", cache.isIndexed())
          },
          {
            "iconClass": (this.calculateNotificationClasses)("fa-puzzle-piece", cache.hasCompatibility())
          },
          {
            "iconClass": (this.calculateNotificationClasses)("pficon-history", cache.hasRemoteBackup())
          }
        ]
      };
    });

    this.containerService.cachesAvailability(this.container, cacheToQuery).then(result => {
      let cacheCounter: number = 0;
      for (let resultField in result) {
        let cacheResponse: any = result[resultField];
        let validResponse: boolean = cacheResponse.outcome === "success" ? true : false;
        let cacheName: string = cacheToQuery[cacheCounter].name;
        if (validResponse) {
          this.cacheAvailability[cacheName] = cacheResponse.result === "AVAILABLE" ? true : false;
        } else {
          this.cacheAvailability[cacheName] = false;
        }
        cacheCounter += 1;
      }
    });

    this.containerService.cachesEnablement(this.container, caches).then(result => {
        for (let resultField in result) {
          let cacheResponse: any = result[resultField];
          let validResponse: boolean = cacheResponse.outcome === "success" ? true : false;
          if (validResponse) {
            let cacheEnablementResponse: any = cacheResponse.result;
            for (let cacheName in cacheEnablementResponse) {
              this.cacheEnablement[cacheName] = !cacheEnablementResponse[cacheName];
            }
          }
        }
      }
    );

    this.filteredCaches = this.search();
  }

  createCache(): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/caches/view/add-cache-modal.html",
      controller: AddCacheModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        templates: (): ITemplate[] => this.templates
      }
    });
  }

  isAvailable(cache: ICache): boolean {
    let result: boolean = this.cacheAvailability[cache.name];
    if (isNullOrUndefined(result)) {
      return false;
    } else {
      return result;
    }
  }

  isEnabled(cache: ICache): boolean {
    let result: boolean = this.cacheEnablement[cache.name];
    if (isNullOrUndefined(result)) {
      return false;
    } else {
      return result;
    }
  }

  isStatusAvailable(cache: ICache): boolean {
    return isNotNullOrUndefined(this.cacheAvailability[cache.name]) &&
      isNotNullOrUndefined(this.cacheEnablement[cache.name]);
  }

  isAvailableAndEnabled(cache: ICache): boolean {
    return this.isEnabled(cache) && this.isAvailable(cache);
  }

  search(): any {
    if (!this.hasFiltersApplied()) {
      return this.filteredCaches = this.caches;
    } else {
      const byName: any  = this.$filter("filter")(this.caches, {name: this.searchNameQuery});
      const byTrait: any = this.$filter("cacheTraitFilter")(byName, this.traitCheckboxes);
      const byType: any  = this.$filter("cacheTypeFilter")(byTrait, this.typeCheckboxes);
      const final: any   = this.$filter("cacheStatusFilter")(byType, this.statusCheckboxes);
      this.filteredCaches = final;
      return final;
    }
  }

  clearFilters(): void {
    this.resetFilterCheckboxes(this.traitCheckboxes);
    this.resetFilterCheckboxes(this.typeCheckboxes);
    this.resetFilterCheckboxes(this.statusCheckboxes);
    this.filteredCaches = this.caches;
    this.searchNameQuery = "";
  }

  hasFiltersApplied(): boolean {
    return this.searchNameQuery && this.searchNameQuery.length > 0 ||
        this.checkIfFilterSelected(this.traitCheckboxes) ||
        this.checkIfFilterSelected(this.typeCheckboxes) ||
        this.checkIfFilterSelected(this.statusCheckboxes);
  }

  private truthyCheckForCheckboxes(checkboxType: any): any {
    return function(prop: any): any {
      return checkboxType[prop];
    };
  }

  private checkIfFilterSelected(filter: any): boolean {
    return Object.keys(filter).some(this.truthyCheckForCheckboxes(filter));
  }

  private resetFilterCheckboxes(filter: any): any {
    return Object.keys(filter).forEach((prop) => filter[prop] = false);
  }

  private calculateNotificationClasses(notificationClass: String, cacheMethod: Boolean): string {
    return `fa ${notificationClass} ${cacheMethod ? "black" : "gray"}`;
  }
}
