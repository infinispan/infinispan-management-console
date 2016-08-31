import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {DmrService} from "../../services/dmr/DmrService";
import {IStateService} from "angular-ui-router";
import {ICache} from "../../services/cache/ICache";
import {TraitCheckboxes} from "./filters/CacheTraitFilter";
import {StatusCheckboxes} from "./filters/CacheStatusFilter";
import {TypeCheckboxes} from "./filters/CacheTypeFilter";

export class CachesCtrl {

  static $inject: string[] = ["$state", "containerService", "dmrService", "container", "caches"];

  name: string;
  serverGroup: string;
  traitCheckboxes: TraitCheckboxes = new TraitCheckboxes();
  typeCheckboxes: TypeCheckboxes = new TypeCheckboxes();
  statusCheckboxes: StatusCheckboxes = new StatusCheckboxes();
  isCollapsedTrait: boolean = false;
  isCollapsedType: boolean = false;
  isCollapsedStatus: boolean = false;

  constructor(private $state: IStateService,
              private containerService: ContainerService,
              private dmrService: DmrService,
              public container: ICacheContainer,
              public caches: ICache[]) {
    this.name = container.name;
    this.serverGroup = container.serverGroup.name;
  }

  refresh(): void {
    this.dmrService.clearGetCache();
    this.$state.reload();
  }
}
