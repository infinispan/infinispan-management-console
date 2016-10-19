import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ICache} from "./ICache";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {Cache} from "./Cache";
import {CacheConfigService, CACHE_TYPES} from "../cache-config/CacheConfigService";
import {IServerAddress} from "../server/IServerAddress";
import {ICacheContainer} from "../container/ICacheContainer";
import {JGroupsService} from "../jgroups/JGroupsService";
import {isNullOrUndefined} from "../../common/utils/Utils";
import {ICacheConfiguration} from "../cache-config/ICacheConfiguration";

const module: ng.IModule = App.module("managementConsole.services.cache", []);

export class CacheService {
  static $inject: string[] = ["$q", "dmrService", "jGroupsService", "launchType", "cacheConfigService"];

  constructor(private $q: ng.IQService,
              private dmrService: DmrService,
              private jgroupsService: JGroupsService,
              private launchType: LaunchTypeService,
              private cacheConfigService: CacheConfigService) {
  }

  getAllCachesInContainer(container: ICacheContainer): ng.IPromise<ICache[]> {
    let deferred: ng.IDeferred<ICache[]> = this.$q.defer<ICache[]>();
    let request: IDmrRequest = {
      address: this.generateContainerAddress(container.name, container.profile),
      recursive: true,
      "recursive-depth": 1
    };

    let caches: ICache[] = [];
    this.dmrService.readResource(request)
      .then(response => {
        for (let cacheType of CACHE_TYPES) {
          if (isNullOrUndefined(response[cacheType])) {
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
        return this.$q.all(caches.map(cache => {
          return this.cacheConfigService.getTemplate(container, cache.type, cache.configName);
        }));
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
    let deferred: ng.IDeferred<ICache> = this.$q.defer<ICache>();
    let request: IDmrRequest = {
      address: this.generateContainerAddress(container, profile).concat(type, name)
    };
    this.dmrService.readResource(request).then((response) => deferred.resolve(new Cache(name, type, response.configuration)));
    return deferred.promise;
  }

  getCacheTemplate(container: ICacheContainer, type: string, name: string): ng.IPromise<any> {
    let deferred: ng.IDeferred<any> = this.$q.defer();
    this.getCache(name, type, container.name, container.profile)
      .then(cache => this.cacheConfigService.getTemplate(container, type, cache.configName))
      .then(template => deferred.resolve(template));
    return deferred.promise;
  }

  createCacheFromConfiguration(container: ICacheContainer, type: string, name: string, configuration: string): ng.IPromise<void> {
    return this.dmrService.add({
      address: this.generateContainerAddress(container.name, container.profile).concat(type, name),
      configuration: configuration
    });
  }

  createCacheAndConfiguration(container: ICacheContainer, type: string, name: string, config: any): ng.IPromise<void> {
    let deferred: ng.IDeferred<void> = this.$q.defer<void>();
    this.cacheConfigService.createCacheConfiguration(container, type, name, config)
      .then(() => deferred.resolve(this.createCacheFromConfiguration(container, type, name, name)));
    return deferred.promise;
  }

  getCacheStats(container: ICacheContainer, cache: ICache): ng.IPromise<any> {
    let firstServer: IServerAddress = container.serverGroup.members[0];
    let address: string [] = this.generateHostServerAddress(firstServer, container, cache);
    let request: IDmrRequest = {
      address: address,
      "include-runtime": true,
      recursive: true
    };
    return this.dmrService.readResource(request);
  }

  getCacheStatsForServers(container: ICacheContainer, cache: ICache): ng.IPromise<any[]> {
    let promises: ng.IPromise<any> [] = [];
    let servers: IServerAddress [] = container.serverGroup.members;
    for (let server of servers) {
      let address: string [] = this.generateHostServerAddress(server, container, cache);
      let request: IDmrRequest = {
        address: address,
        "include-runtime": true,
        recursive: true
      };
      promises.push(this.dmrService.readResource(request));
    }
    return this.$q.all(promises);
  }

  startCache(container: ICacheContainer, cache: ICache): ng.IPromise<any> {
    return this.executeCacheOp(container.name, container.profile, cache, "start-cache");
  }

  stopCache(container: string, profile: string, cache: ICache): ng.IPromise<any> {
    return this.executeCacheOp(container, profile, cache, "stop-cache");
  }

  flushCache(container: ICacheContainer, cache: ICache): ng.IPromise<any> {
    return this.executeCacheOp(container.name, container.profile, cache, "flush-cache");
  }

  indexCache(container: ICacheContainer, cache: ICache): ng.IPromise<any> {
    return this.executeCacheOp(container.name, container.profile, cache, "mass-reindex");
  }

  clearCache(container: ICacheContainer, cache: ICache): ng.IPromise<any> {
    return this.executeCacheOp(container.name, container.profile, cache, "clear-cache");
  }

  resetStats(container: ICacheContainer, cache: ICache): ng.IPromise<any> {
    return this.executeCacheOp(container.name, container.profile, cache, "reset-statistics");
  }

  isEnabled(profile: string, cache: ICache): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "is-ignored-all-endpoints",
      address: this.generateEndpointAddress(profile),
      "cache-names": [cache.name],
    });
  }

  enable(profile: string, cache: ICache): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "unignore-cache-all-endpoints",
      address: this.generateEndpointAddress(profile),
      "cache-names": [cache.name],
    });
  }

  disable(profile: string, cache: ICache): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "ignore-cache-all-endpoints",
      address: this.generateEndpointAddress(profile),
      "cache-names": [cache.name],
    });
  }

  setRebalance(container: ICacheContainer, cache: ICache, rebalance: boolean): ng.IPromise<any> {
    return this.jgroupsService.getServerGroupCoordinator(container.serverGroup).then((coord: IServerAddress) => {
      return this.dmrService.executePost({
        operation: "cache-rebalance",
        address: this.generateHostServerAddress(coord, container, cache),
        value: rebalance.toString()
      });
    });
  }

  private executeCacheOp(container: string, profile: string, cache: ICache, cacheOp: string): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: cacheOp,
      address: this.generateContainerAddress(container, profile).concat(cache.type, cache.name)
    });
  }

  private generateContainerAddress(container: string, profile?: string): string[] {
    let path: string[] = ["subsystem", "datagrid-infinispan", "cache-container", container];
    return this.launchType.getProfilePath(profile).concat(path);
  }

  private generateEndpointAddress(profile?: string): string[] {
    let path: string[] = ["subsystem", "datagrid-infinispan-endpoint"];
    return this.launchType.getProfilePath(profile).concat(path);
  }

  private generateHostServerAddress(server: IServerAddress, container: ICacheContainer, cache: ICache): string[] {
    let path: string[] = ["subsystem", "datagrid-infinispan", "cache-container", container.name, cache.type, cache.name];
    return this.launchType.getRuntimePath(server).concat(path);
  }
}

module.service("cacheService", CacheService);
