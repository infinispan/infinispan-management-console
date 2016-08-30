import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ICache} from "./ICache";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {UtilsService} from "../utils/UtilsService";
import {Cache} from "./Cache";
import {ICacheConfiguration} from "./ICacheConfiguration";

const module: ng.IModule = App.module("managementConsole.services.cache", []);

export const CACHE_TYPES: string[] = ["distributed-cache", "replicated-cache", "local-cache", "invalidation-cache"];

export class CacheService {
  static $inject: string[] = ["$q", "dmrService", "launchType", "utils"];

  constructor(private $q: ng.IQService,
              private dmrService: DmrService,
              private launchType: LaunchTypeService,
              private utils: UtilsService) {
  }

  getAllCachesInContainer(container: string, profile?: string): ng.IPromise<ICache[]> {
    let deferred: ng.IDeferred<ICache[]> = this.$q.defer<ICache[]>();
    let request: IDmrRequest = {
      address: this.generateAddress(container, profile),
      recursive: true,
      "recursive-depth": 1
    };

    let caches: ICache[] = [];
    this.dmrService.readResource(request)
      .then(response => {
        for (let cacheType of CACHE_TYPES) {
          if (this.utils.isNullOrUndefined(response[cacheType])) {
            continue; // Do nothing as no caches of this type exist
          }

          for (let cacheName of Object.keys(response[cacheType])) {
            let cache: any = response[cacheType][cacheName];
            caches.push(new Cache(cacheName, cacheType, cache.configuration));
          }
        }
        return caches;
      })
      .then(caches => {
        // Get config object for all caches
        return this.$q.all(caches.map(cache => this.getCacheConfiguration(cache.name, cache.type, container, profile)));
      })
      .then(configurations => {
        // Add config object to all caches
        for (let cacheIndex in caches) {
          caches[cacheIndex].configModel = <ICacheConfiguration> configurations[cacheIndex];
        }
        deferred.resolve(caches);
      });
    return deferred.promise;
  }

  getAllCachesByType(): ICache[] {
    return [];
  }

  getCache(name: string, type: string, container: string, profile?: string): ng.IPromise<ICache> {
    let typeKey: string = this.utils.convertCacheAttributeIntoFieldName(type);
    let deferred: ng.IDeferred<ICache> = this.$q.defer<ICache>();
    let request: IDmrRequest = {
      address: this.generateAddress(container, profile).concat(typeKey, type)
    };
    this.dmrService.readResource(request).then((response) => deferred.resolve(new Cache(name, type, response.configuration)));
    return deferred.promise;
  }

  getCacheConfiguration(name: string, type: string, container: string, profile?: string): ng.IPromise<ICacheConfiguration> {
    let request: IDmrRequest = {
      address: this.generateAddress(container, profile).concat("configurations", "CONFIGURATIONS",
        type + "-configuration", name),
      recursive: true
    };
    return this.dmrService.readResource(request);
  }

  private generateAddress(container: string, profile?: string): string[] {
    let address: string[] = this.launchType.isStandaloneMode() ? [] : [].concat("profile", profile);
    return address.concat("subsystem", "datagrid-infinispan", "cache-container", container);
  }
}

module.service("cacheService", CacheService);
