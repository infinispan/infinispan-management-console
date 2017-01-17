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
import interpolateNumber = d3.interpolateNumber;

export class CachesCtrl {
  static $inject: string[] = ["$uibModal", "container", "caches", "templates", "cacheService", "containerService"];

  traitCheckboxes: TraitCheckboxes = new TraitCheckboxes();
  typeCheckboxes: TypeCheckboxes = new TypeCheckboxes();
  statusCheckboxes: StatusCheckboxes = new StatusCheckboxes();

  isCollapsedTrait: boolean = false;
  isCollapsedType: boolean = false;
  isCollapsedStatus: boolean = false;
  cacheAvailability: IMap<boolean> = {};
  cacheEnablement: IMap<boolean> = {};

  constructor(private $uibModal: IModalService,
              public container: ICacheContainer,
              public caches: ICache[],
              public templates: ITemplate[],
              public cacheService: CacheService,
              private containerService: ContainerService) {

    //query only distributed and replicated caches (local and invalidation don't have availability attribute)
    let cacheToQuery: ICache [] = [];
    for (let cache of caches) {
      if (cache.isLocal() || cache.isInvalidation()) {
        this.cacheAvailability[cache.name] = true;
      } else {
        cacheToQuery.push(cache);
      }
    }

    this.containerService.cachesAvailability(this.container, cacheToQuery).then((result)=> {
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

    this.containerService.cachesEnablement(this.container, caches).then((result) => {
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
}
