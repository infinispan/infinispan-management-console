import {ICache} from "../../../services/cache/ICache";

export class StatusCheckboxes {
  indexing: boolean = false;
  offline: boolean = false;
  rebalancing: boolean = false;
  splitbrain: boolean = false;
}

export function cacheStatusFilter(): Function {
  return (caches: ICache[], statuses: StatusCheckboxes) => {
    let atLeastOneFilterExists: boolean = Object.keys(statuses).some(status => statuses[status]);
    if (atLeastOneFilterExists) {
      // TODO
      let filteredCaches: ICache[] = [];
      return filteredCaches;
    } else {
      return caches;
    }
  };
}
