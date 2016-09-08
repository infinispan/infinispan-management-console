import {App} from "../../ManagementConsole";
import {CacheCtrl} from "./CacheCtrl";
import {CacheService} from "../../services/cache/CacheService";
import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {ICache} from "../../services/cache/ICache";
import {CacheNodesCtrl} from "./CacheNodesCtrl";

const module: ng.IModule = App.module("managementConsole.cache", []);

module.controller("CacheCtrl", CacheCtrl);
module.controller("CacheCtrl", CacheNodesCtrl);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("cache", {
    parent: "root",
    url: "containers/:profileName/:containerName/caches/:cacheName/:cacheType",
    templateUrl: "module/cache/view/cache.html",
    controller: CacheCtrl,
    controllerAs: "ctrl",
    resolve: {
      container: ["$stateParams", "containerService",
        ($stateParams, containerService: ContainerService) => {
          return containerService.getContainer($stateParams.containerName, $stateParams.profileName);
        }],
      cache: ["$stateParams", "cacheService",
        ($stateParams, cacheService: CacheService) => {
          return cacheService.getCacheUsingType($stateParams.cacheName, $stateParams.cacheType, $stateParams.containerName, $stateParams.profileName);
        }],
      stats: ["$stateParams", "container", "cache", "cacheService",
        ($stateParams, container: ICacheContainer, cache: ICache, cacheService: CacheService) => {
          return cacheService.getCacheStats(container, cache);
        }],
      cacheEnabledRSP: ["$stateParams", "container", "cache", "cacheService",
        ($stateParams, container: ICacheContainer, cache: ICache, cacheService: CacheService) => {
          return cacheService.isEnabled(container.profile, cache);
        }],
    }
  });

  $stateProvider.state("caches-node-stats", {
    parent: "root",
    url: "containers/:profileName/:containerName/nodes",
    templateUrl: "module/cache/view/nodes.html",
    controller: CacheNodesCtrl,
    controllerAs: "ctrl",
    resolve: {
      container: ["$stateParams", "containerService",
        ($stateParams, containerService: ContainerService) => {
          return containerService.getContainer($stateParams.containerName, $stateParams.profileName);
        }],
      cache: ["$stateParams", "cacheService",
        ($stateParams, cacheService: CacheService) => {
          return cacheService.getCacheUsingType("default", "distributed-cache", $stateParams.containerName, $stateParams.profileName);
        }],
      allCacheStats: ["cacheService", "container", "cache",
        (cacheService: CacheService, container: ICacheContainer, cache:ICache) => {
          return cacheService.getCacheStatsForServers(container, cache);
        }]
    }
  });
});
