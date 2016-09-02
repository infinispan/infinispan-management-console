import {ICache} from "../../../services/cache/ICache";

export class TypeCheckboxes {
  local: boolean = false;
  distributed: boolean = false;
  replicated: boolean = false;
  invalidation: boolean = false;
}

export function cacheTypeFilter(): Function {
  return (caches: ICache[], types: TypeCheckboxes) => {
    let atLeastOneFilterExists: boolean = Object.keys(types).some(type => types[type]);
    if (atLeastOneFilterExists) {
      let filteredCaches: ICache[] = [];
      angular.forEach(caches, cache => {
        let local: boolean = types.local && cache.isLocal();
        let distributed: boolean = types.distributed && cache.isDistributed();
        let invalidation: boolean = types.invalidation && cache.isInvalidation();
        let replicated: boolean = types.replicated && cache.isReplicated();

        if (local || distributed || invalidation || replicated) {
          filteredCaches.push(cache);
        }
      });
      return filteredCaches;
    } else {
      return caches;
    }
  };
}
