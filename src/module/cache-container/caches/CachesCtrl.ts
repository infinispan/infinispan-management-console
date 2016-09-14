import {ICache} from "../../../services/cache/ICache";
import {StatusCheckboxes} from "./filters/CacheStatusFilter";
import {TypeCheckboxes} from "./filters/CacheTypeFilter";
import {TraitCheckboxes} from "./filters/CacheTraitFilter";
import {AddCacheModalCtrl} from "./AddCacheModalCtrl";
import IModalService = angular.ui.bootstrap.IModalService;
import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {ITemplate} from "../../../services/container-config/ITemplate";

export class CachesCtrl {
  static $inject: string[] = ["$uibModal", "container", "caches", "templates"];

  traitCheckboxes: TraitCheckboxes = new TraitCheckboxes();
  typeCheckboxes: TypeCheckboxes = new TypeCheckboxes();
  statusCheckboxes: StatusCheckboxes = new StatusCheckboxes();

  isCollapsedTrait: boolean = false;
  isCollapsedType: boolean = false;
  isCollapsedStatus: boolean = false;

  constructor(private $uibModal: IModalService,
              public container: ICacheContainer,
              public caches: ICache[],
              public templates: ITemplate[]) {
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
}
