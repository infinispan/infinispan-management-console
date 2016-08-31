import {ICache} from "../../services/cache/ICache";
import {StatusCheckboxes} from "./filters/CacheStatusFilter";
import {TypeCheckboxes} from "./filters/CacheTypeFilter";
import {TraitCheckboxes} from "./filters/CacheTraitFilter";

export class CachesCtrl {
  static $inject: string[] = ["caches"];

  traitCheckboxes: TraitCheckboxes = new TraitCheckboxes();
  typeCheckboxes: TypeCheckboxes = new TypeCheckboxes();
  statusCheckboxes: StatusCheckboxes = new StatusCheckboxes();

  isCollapsedTrait: boolean = false;
  isCollapsedType: boolean = false;
  isCollapsedStatus: boolean = false;

  constructor(public caches: ICache[]) {
  }
}
