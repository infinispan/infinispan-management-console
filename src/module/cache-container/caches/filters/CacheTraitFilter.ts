import {ICache} from "../../../services/cache/ICache";

export class TraitCheckboxes {
  bounded: boolean = false;
  remotebackup: boolean = false;
  indexed: boolean = false;
  compatible: boolean = false;
  persistent: boolean = false;
  secure: boolean = false;
  transactional: boolean = false;
}

export function cacheTraitFilter(): Function {
  return (caches: ICache[], traits: TraitCheckboxes) => {
    let atLeastOneFilterExists: boolean = Object.keys(traits).some(trait => traits[trait]);
    if (atLeastOneFilterExists) {
      let filteredCaches: ICache[] = [];
      angular.forEach(caches, cache => {
        let bounded: boolean = traits.bounded && cache.isBounded();
        let indexed: boolean = traits.indexed && cache.isIndexed();
        let compatible: boolean = traits.compatible && cache.hasCompatibility();
        let remoteBackup: boolean = traits.remotebackup && cache.hasRemoteBackup();
        let persistent: boolean = traits.persistent && cache.isPersistent();
        let secure: boolean = traits.secure && cache.isSecured();
        let transactional: boolean = traits.transactional && cache.isTransactional();

        if (bounded || indexed || remoteBackup || compatible || persistent || secure || transactional) {
          filteredCaches.push(cache);
        }
      });
      return filteredCaches;
    } else {
      return caches;
    }
  };
}
