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
import {isNullOrUndefined} from "../../../common/utils/Utils";

export class CachesCtrl {
  static $inject: string[] = ["$uibModal", "container", "caches", "templates", "cacheService"];

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
              public cacheService: CacheService) {
    for (let c of caches) {
      this.cacheService.isAvailable(this.container, c)
        .then(result => this.cacheAvailability[c.name] = result);

      this.cacheService.isEnabled(this.container.profile, c)
        .then(result => this.cacheEnablement[c.name] = !result[c.name]);
    }
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
}
